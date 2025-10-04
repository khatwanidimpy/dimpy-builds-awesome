export interface User {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  role?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}