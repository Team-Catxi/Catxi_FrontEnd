export interface ParticipantsResponse {
  success: boolean;
  data: string[]; 
}

export interface ParticipantUpdateMessage {
  roomId: number;
  participantNicknames: string[];
}
