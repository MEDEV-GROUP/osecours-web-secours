declare module 'AuthContext' {
    interface User {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    }
  
    interface AuthContextType {
      isAuthenticated: boolean;
      user: User | null;
      login: (email: string, password: string) => Promise<void>;
      logout: () => void;
      error: string | null;
      isLoading: boolean;
    }
  
    export const AuthProvider: React.FC<{ children: React.ReactNode }>;
    export const useAuth: () => AuthContextType;
  }
  