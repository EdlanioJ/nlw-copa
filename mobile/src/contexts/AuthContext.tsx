import { createContext, ReactNode, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

import { api } from '../api/api';
import { useAuthWithGoogle, useLogout } from '../api/hooks';
import { Loading } from '../components/Loading';
import { tokenService } from '../services/token';

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

WebBrowser.maybeCompleteAuthSession();
export function AuthProvider({ children }: AuthProviderProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { mutate, isLoading } = useAuthWithGoogle();
  const { mutateAsync: logout } = useLogout();

  const [_, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email'],
  });

  function signInWithGoogle(token: string) {
    mutate(token, {
      onSuccess: async (tokenResponse) => {
        await tokenService.setTokens(tokenResponse);

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
    await logout(undefined, {
      onSuccess: async () => {
        await tokenService.clearTokens();
        setIsSigned(false);
      },
      onError: (error) => {
        console.log(error);
        throw error;
      },
    });
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        setIsAppLoading(true);
        const token = await tokenService.getAccessToken();
        if (!token) {
          setIsSigned(false);
          return;
        }

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
    <AuthContext.Provider
      value={{
        signIn,
        isUserLoading: isLoading || isUserLoading,
        isSigned,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
