
export interface Audiobook {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  audio_url: string;
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface ListeningProgress {
  id: string;
  user_id: string;
  audiobook_id: string;
  current_position: number;
  completed: boolean;
  last_listened_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
}
