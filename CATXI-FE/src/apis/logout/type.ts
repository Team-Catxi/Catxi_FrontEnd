export interface LogoutResponse {
  success: boolean;
  code: string;
  message: string;
  data: Record<string, unknown>;
}
