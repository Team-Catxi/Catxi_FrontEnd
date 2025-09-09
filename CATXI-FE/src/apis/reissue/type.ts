export interface ReissueResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}