import axios from 'axios';
import { TokenData, tokenService } from '../services/token';

const API_URL = process.env.API_URL;
const urlRefreshToken = '/auth/refresh';

const api = axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenService.getAccessToken();
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig.retry) {
        originalConfig.retry = true;
        try {
          const token = await tokenService.getRefreshToken();
          if (token) {
            const res = await axios.post<TokenData>(
              `${API_URL}${urlRefreshToken}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const { accessToken, refreshToken } = res.data;
            await tokenService.setTokens({ accessToken, refreshToken });

            return api(originalConfig);
          }
        } catch (_error) {
          console.log({ _error });
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export { api };
