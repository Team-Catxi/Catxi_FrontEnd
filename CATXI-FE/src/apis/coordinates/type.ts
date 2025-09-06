export interface SaveDepartRequest {
  latitude: number;
  longitude: number;
}

export interface SaveDepartResponse {
  success: boolean;
  code: string;
  message: string;
  data: Record<string, any>; 
}
