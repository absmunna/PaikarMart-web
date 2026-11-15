export type AiRole = 'general' | 'wholesale' | 'vendor' | 'services';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MapPlaceResult {
  title: string;
  uri: string;
  placeAnswerSources?: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: GroundingSource[];
  places?: MapPlaceResult[];
}

export interface SearchGroundingResponse {
  text: string;
  sources: GroundingSource[];
}

export interface MapsGroundingResponse {
  text: string;
  places: MapPlaceResult[];
}

export interface TranscriptionResponse {
  transcription: string;
}
