import { createContext, ReactNode, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthWithGoogle } from '../api/hooks';
import { Loading } from '../components/Loading';

export interface UserData {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  isSigned: boolean;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextDataProps);

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_STORAGE_KEY = '@nlwcopamobile:token';

WebBrowser.maybeCompleteAuthSession();
export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { mutate } = useAuthWithGoogle();

  const [_, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  function signInWithGoogle(token: string) {
    mutate(token, {
      onSuccess: async (tokenResponse) => {
        api.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${tokenResponse}`;

        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, tokenResponse);
        setIsSigned(true);
      },
      onError: (error) => {
        console.log(error);
      },
    });
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

  async function signOut() {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      setIsSigned(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        setIsAppLoading(true);
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) {
          setIsSigned(false);
          return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsSigned(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAppLoading(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken);
    }
  }, [response]);

  if (isAppLoading) return <Loading />;

  return (
    <AuthContext.Provider value={{ signIn, isUserLoading, isSigned, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
