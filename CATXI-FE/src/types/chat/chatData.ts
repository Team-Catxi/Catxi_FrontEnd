import type { ApiResponse } from "../apiResponse";

export const ChatRoomStatus = {
  WAITING: 'WAITING',
  READY_LOCKED: 'READY_LOCKED',
  MATCHED: 'MATCHED',
  EXPIRED: 'EXPIRED',
} as const;

export const Stations = {
  MARIA: 'MARIA',
  LIBRARY: 'LIBRARY',
  DASOL: 'DASOL',
  CONCERT_HALL: 'CONCERT_HALL',
  PHARMACY: 'PHARMACY',
  SOSA_ST: 'SOSA_ST',
  BUCHEON_ST: 'BUCHEON_ST',
  YEOKGOK_ST: 'YEOKGOK_ST',
  GURO_ST: 'GURO_ST',
  SINDORIM_ST: 'SINDORIM_ST',
  STUDENT_CENTER: 'STUDENT_CENTER'
} as const;

export type ChatRoomStatus = typeof ChatRoomStatus[keyof typeof ChatRoomStatus];

export type Station = typeof Stations[keyof typeof Stations];

export interface ChatMessageItem {
  messageId: number;
  roomId: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  content: string;
  sentAt: string;
};

export interface ChatMessagePageData {
  messages: ChatMessageItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ChatRoomItem {
    roomId: number;
    hostId: number;
    hostName: string;
    hostNickname: string;
    matchCount: number,
    startPoint: string;
    endPoint: string;
    recruitSize: number;
    currentSize: number;
    status: ChatRoomStatus;
    departAt: string;
    createdTime: string;
}

export interface ChatRoomList {
    content: ChatRoomItem[];
    totalPages: number;
    totalElements: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
};

export interface ChatRoomData {
  myRoomId: number;
  rooms: ChatRoomList;
}

export type ChatMessagesResponse = ApiResponse<ChatMessagePageData>;

export type ChatRoomResponse = ApiResponse<ChatRoomData>;
