export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
}

export interface SheetRow {
  [key: string]: string;
}

export interface SpreadsheetData {
  spreadsheetId: string;
  title: string;
  sheets: {
    title: string;
    properties: any;
  }[];
}

export interface DocData {
  documentId: string;
  title: string;
  bodyContent?: string;
}

export interface FormResponse {
  responseId: string;
  submittedAt: string;
  answers: {
    questionId: string;
    questionTitle: string;
    answer: string;
  }[];
}

export interface FormData {
  formId: string;
  title: string;
  description?: string;
  responderUri?: string;
  responses?: FormResponse[];
}

export interface MeetSpace {
  name: string; // Resource name of the space
  meetingUri: string; // The URL to join the meet
  meetingCode: string;
  config?: {
    accessType?: string;
    entryPointAccess?: string;
  };
}

export interface ChatSpaceItem {
  name: string; // Resource name
  displayName: string;
  type: string;
}

export interface ChatMessageItem {
  name: string;
  text: string;
  createTime: string;
}
