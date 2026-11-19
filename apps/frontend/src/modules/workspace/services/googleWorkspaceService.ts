import { DriveFile, SheetRow, SpreadsheetData, DocData, FormData, MeetSpace, ChatSpaceItem } from '../types';

export class GoogleWorkspaceService {
  private static getHeaders(accessToken: string) {
    return {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  // ==========================================
  // 1. GOOGLE DRIVE API
  // ==========================================
  
  static async listFiles(accessToken: string): Promise<DriveFile[]> {
    const url = 'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime,size)&orderBy=modifiedTime desc';
    const response = await fetch(url, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to list Drive files: ${response.statusText}`);
    }
    const data = await response.json();
    return data.files || [];
  }

  static async createFolder(accessToken: string, name: string): Promise<DriveFile> {
    const url = 'https://www.googleapis.com/drive/v3/files';
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        name,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Folder: ${response.statusText}`);
    }
    return await response.json();
  }

  static async deleteFile(accessToken: string, fileId: string): Promise<void> {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }
  }

  // ==========================================
  // 2. GOOGLE SHEETS API
  // ==========================================

  static async createSpreadsheet(accessToken: string, title: string): Promise<SpreadsheetData> {
    const url = 'https://sheets.googleapis.com/v4/spreadsheets';
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        properties: {
          title,
        },
        sheets: [
          {
            properties: {
              title: 'Product Catalog',
            },
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create spreadsheet: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      spreadsheetId: data.spreadsheetId,
      title: data.properties.title,
      sheets: data.sheets.map((s: any) => ({
        title: s.properties.title,
        properties: s.properties,
      })),
    };
  }

  static async addSpreadsheetRow(
    accessToken: string,
    spreadsheetId: string,
    sheetTitle: string,
    values: string[]
  ): Promise<any> {
    const range = `${sheetTitle}!A:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        values: [values],
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to append sheet row: ${response.statusText}`);
    }
    return await response.json();
  }

  static async readSpreadsheetValues(
    accessToken: string,
    spreadsheetId: string,
    range: string
  ): Promise<string[][]> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to read spreadsheet values: ${response.statusText}`);
    }
    const data = await response.json();
    return data.values || [];
  }

  // ==========================================
  // 3. GOOGLE DOCS API
  // ==========================================

  static async createDocument(accessToken: string, title: string): Promise<DocData> {
    const url = 'https://docs.googleapis.com/v1/documents';
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        title,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Google Doc: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      documentId: data.documentId,
      title: data.title,
    };
  }

  static async updateDocumentText(
    accessToken: string,
    documentId: string,
    text: string
  ): Promise<any> {
    const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: {
                index: 1,
              },
              text,
            },
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to insert document text: ${response.statusText}`);
    }
    return await response.json();
  }

  // ==========================================
  // 4. GOOGLE FORMS API
  // ==========================================

  static async createForm(accessToken: string, title: string, description: string): Promise<FormData> {
    const url = 'https://forms.googleapis.com/v1/forms';
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        info: {
          title,
          description,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Google Form: ${response.statusText}`);
    }
    const data = await response.json();

    // Now, let's update it to add questions (batchUpdate)
    try {
      const updateUrl = `https://forms.googleapis.com/v1/forms/${data.formId}:batchUpdate`;
      await fetch(updateUrl, {
        method: 'POST',
        headers: this.getHeaders(accessToken),
        body: JSON.stringify({
          requests: [
            {
              createItem: {
                item: {
                  title: 'What was your overall satisfaction with the product wholesale pricing?',
                  questionItem: {
                    question: {
                      required: true,
                      choiceQuestion: {
                        type: 'RADIO',
                        options: [
                          { value: 'Excellent (৳ চমৎকার)' },
                          { value: 'Good (৳ ভালো)' },
                          { value: 'Average (৳ সাধারণ)' },
                          { value: 'Poor (৳ দুর্বল)' }
                        ]
                      }
                    }
                  }
                },
                location: { index: 0 }
              }
            },
            {
              createItem: {
                item: {
                  title: 'Write down your business feedback or requests below.',
                  questionItem: {
                    question: {
                      textQuestion: { paragraph: true }
                    }
                  }
                },
                location: { index: 1 }
              }
            }
          ]
        })
      });
    } catch (e) {
      console.error('Error adding questions to form:', e);
    }

    return {
      formId: data.formId,
      title: data.info?.title || title,
      responderUri: data.responderUri,
    };
  }

  static async getFormResponses(accessToken: string, formId: string): Promise<any[]> {
    const url = `https://forms.googleapis.com/v1/forms/${formId}/responses`;
    const response = await fetch(url, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      // It's normal for newly created forms to not have any responses yet, so we return empty
      return [];
    }
    const data = await response.json();
    return data.responses || [];
  }

  // ==========================================
  // 5. GOOGLE MEET API
  // ==========================================

  static async createMeetingSpace(accessToken: string): Promise<MeetSpace> {
    const url = 'https://meet.googleapis.com/v2/spaces';
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        config: {
          accessType: 'OPEN'
        }
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create Meet space: ${response.statusText}`);
    }
    const data = await response.json();
    const cleanCode = data.meetingCode || data.meetingUri?.split('/').pop() || 'xyz-abc-def';
    return {
      name: data.name,
      meetingUri: data.meetingUri || `https://meet.google.com/${cleanCode}`,
      meetingCode: cleanCode,
      config: data.config
    };
  }

  // ==========================================
  // 6. GOOGLE CHAT API
  // ==========================================

  static async listChatSpaces(accessToken: string): Promise<ChatSpaceItem[]> {
    const url = 'https://chat.googleapis.com/v1/spaces';
    const response = await fetch(url, {
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error(`Failed to list Chat spaces: ${response.statusText}`);
    }
    const data = await response.json();
    return data.spaces || [];
  }

  static async sendChatMessage(accessToken: string, spaceName: string, text: string): Promise<any> {
    const url = `https://chat.googleapis.com/v1/${spaceName}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(accessToken),
      body: JSON.stringify({
        text,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send Chat message: ${response.statusText}`);
    }
    return await response.json();
  }
}
