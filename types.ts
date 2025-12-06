export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export interface Story {
  id: string;
  uploaderId: string; // ID of the user who uploaded
  uploaderName: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  tags: string[];
  status: 'Ongoing' | 'Completed';
  views: number;
  likes: number;
  thanks: number;
  chapters: Chapter[];
  comments: Comment[];
}

export enum TranslationMode {
  LITERAL = 'Literal',
  LITERARY = 'Literary (Tiểu thuyết)',
  SUMMARIZED = 'Summarized'
}

export enum TranslationInputType {
  TEXT = 'text',
  URL = 'url',
  FILE = 'file'
}

export interface GlossaryEntry {
  id: string;
  original: string;
  translated: string;
}

export interface TranslationState {
  sourceText: string;
  sourceUrl?: string;
  translatedText: string;
  isTranslating: boolean;
  mode: TranslationMode;
  inputType: TranslationInputType;
  error: string | null;
  glossary: GlossaryEntry[];
}

export type UserRole = 'owner' | 'co-owner' | 'user';

export interface User {
  id: string; // Added ID for management
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  favorites: string[];
  likedStories: string[];
  password?: string;
  role: UserRole;
  thanksReceived: number; // For leveling
  level: number;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'find-story';
  author: string;
  timestamp: string;
}

export interface AuthContextType {
  user: User | null;
  allUsers: User[]; // For admin management
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; token?: string }>;
  resetPassword: (token: string, newPass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  toggleFavorite: (storyId: string) => void;
  toggleLike: (storyId: string) => void;
  sendThanks: (storyId: string) => void; // Modified to include logic
  isFavorite: (storyId: string) => boolean;
  hasLiked: (storyId: string) => boolean;
  
  // Management Functions
  deleteStory: (storyId: string) => void;
  deleteComment: (storyId: string, commentId: string) => void;
  promoteUser: (userId: string) => void; // Only Owner
  demoteUser: (userId: string) => void; // Only Owner
}