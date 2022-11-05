import { createContext, ReactNode, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../service/api';

interface UserProps {
  name: string;
  avatarUrl: string;
}
export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

type AuthProviderProps = {
  children: ReactNode;
};

WebBrowser.maybeCompleteAuthSession();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({} as UserProps);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  async function signInWithGoogle(token: string) {
    try {
      setIsUserLoading(true);

      const tokenResponse = await api.post('/users', { access_token: token });
      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${tokenResponse.data.token}`;

      const userResponse = await api.get('/me');
      setUser(userResponse.data.user);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  async function signIn() {
    try {
      setIsUserLoading(true);
      await promptAsync();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsUserLoading(false);
    }
  }

  useEffect(() => {
    async function bootstrap() {}

    bootstrap();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  return (
    <AuthContext.Provider value={{ signIn, isUserLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}
