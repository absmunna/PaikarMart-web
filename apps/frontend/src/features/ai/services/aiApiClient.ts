import { 
  AiRole, 
  ChatMessage, 
  SearchGroundingResponse, 
  MapsGroundingResponse, 
  TranscriptionResponse 
} from '@/features/ai/types/ai';

export async function sendChatMessage(
  history: ChatMessage[],
  message: string,
  role: AiRole = 'general',
  isFastMode: boolean = false
): Promise<string> {
  const formattedHistory = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history: formattedHistory,
      message,
      role,
      isFastMode
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Chat AI response failed.');
  }

  const data = await res.json();
  return data.reply;
}

export async function fetchSearchGrounding(prompt: string): Promise<SearchGroundingResponse> {
  const res = await fetch('/api/ai/search-grounding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Search grounding request failed.');
  }

  return await res.json();
}

export async function fetchMapsGrounding(
  prompt: string, 
  userLatLng?: { latitude: number; longitude: number }
): Promise<MapsGroundingResponse> {
  const res = await fetch('/api/ai/maps-grounding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, userLatLng })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Maps grounding request failed.');
  }

  return await res.json();
}

export async function transcribeVoiceAudio(
  base64Audio: string, 
  mimeType: string = 'audio/webm'
): Promise<TranscriptionResponse> {
  const res = await fetch('/api/ai/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Audio, mimeType })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || 'Audio transcription failed.');
  }

  return await res.json();
}
