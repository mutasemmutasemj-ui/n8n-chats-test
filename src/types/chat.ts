export interface Message {
  id: string;
  type: 'text' | 'audio' | 'image' | 'file';
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  fileName?: string;
  fileSize?: number;
}

export interface PageConfig {
  id: string;
  name: string;
  webhookUrl: string;
}
