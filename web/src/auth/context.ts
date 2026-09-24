import { createContext } from 'react';
import type { User } from '../api/types';

export interface AuthState {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  logout: () => {},
});
