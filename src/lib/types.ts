export type Mood =
  | 'joyful'
  | 'nostalgic'
  | 'hopeful'
  | 'peaceful'
  | 'grateful'
  | 'bittersweet';

export const MOODS: { value: Mood; label: string; color: string }[] = [
  { value: 'joyful', label: 'Joyful', color: 'gold' },
  { value: 'nostalgic', label: 'Nostalgic', color: 'lavender' },
  { value: 'hopeful', label: 'Hopeful', color: 'teal' },
  { value: 'peaceful', label: 'Peaceful', color: 'moonlight' },
  { value: 'grateful', label: 'Grateful', color: 'rose' },
  { value: 'bittersweet', label: 'Bittersweet', color: 'lavender' },
];

export type Privacy = 'private' | 'shareable' | 'recipient';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface CapsuleMedia {
  id: string;
  capsule_id: string;
  file_url: string;
  file_type: 'image' | 'video' | 'audio';
  file_name: string;
  display_order: number;
  created_at: string;
}

export interface Capsule {
  id: string;
  user_id: string;
  title: string;
  description: string;
  memory_text: string;
  mood: Mood;
  cover_theme: string;
  cover_image_url: string | null;
  unlock_at: string;
  timezone: string;
  privacy: Privacy;
  recipient_email: string | null;
  recipient_subject: string | null;
  share_token: string;
  created_at: string;
  updated_at: string;
  media?: CapsuleMedia[];
}

export interface Reflection {
  id: string;
  capsule_id: string;
  user_id: string;
  reflection_text: string;
  created_at: string;
}

/** Server-computed only — never trust a client-sent unlock status. */
export function isUnlocked(capsule: Pick<Capsule, 'unlock_at'>): boolean {
  return new Date(capsule.unlock_at).getTime() <= Date.now();
}

/** Capsule shape safe to send to a client BEFORE unlock — content stripped. */
export type LockedCapsule = Omit<Capsule, 'memory_text' | 'media' | 'recipient_email' | 'user_id'>;

export function toLockedCapsule(capsule: Capsule): LockedCapsule {
  const { memory_text, media, recipient_email, user_id, ...safe } = capsule;
  return safe;
}
