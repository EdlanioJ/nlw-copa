import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_STORE = '@nlwcopamobile:accessToken';
const REFRESH_TOKEN_STORE = '@nlwcopamobile:refreshToken';

class TokenService {
  async getAccessToken() {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_STORE);
    return accessToken;
  }

  async getRefreshToken() {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_STORE);
    return refreshToken;
  }

  async setTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_STORE, accessToken],
      [REFRESH_TOKEN_STORE, refreshToken],
    ]);
  }

  async clearTokens() {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_STORE, REFRESH_TOKEN_STORE]);
  }
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export const tokenService = new TokenService();
