import type { ReactNode } from 'react';
import { useLogout, useMe } from '../hooks/auth';
import { AuthContext } from './context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: isPending,
        logout: () => logout.mutate(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
