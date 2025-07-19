// src/mocks/chat.mock.ts

import type {
  ChatMessagesResponse,
  ChatRoomResponse,
} from '../types/chat/chatData';

import type { ChatRoomDetailResponse } from '../types/chat/chatRoomDetail';

// ✅ 1. ChatMessagesResponse
export const mockChatMessages: ChatMessagesResponse = {
  success: true,
  code: 'CHAT_MESSAGES_MOCK_SUCCESS',
  message: '목 채팅 메시지 조회 성공',
  data: [
    {
      messageId: 1,
      roomId: 101,
      senderId: 10,
      senderName: '홍길동',
      senderEmail: 'hong@example.com',
      content: '안녕하세요! 출발 어디서 해요?',
      sentAt: '2025-07-19T10:00:00',
    },
    {
      messageId: 2,
      roomId: 101,
      senderId: 11,
      senderName: '김철수',
      senderEmail: 'kim@example.com',
      content: '신촌역 2번 출구요!',
      sentAt: '2025-07-19T10:01:00',
    },
  ],
};

// ✅ 2. ChatRoomResponse
export const mockChatRooms: ChatRoomResponse = {
  success: true,
  code: 'CHAT_ROOMS_MOCK_SUCCESS',
  message: '목 채팅방 목록 조회 성공',
  data: {
    content: [
      {
        roomId: 101,
        hostId: 10,
        hostName: '홍길동',
        hostNickname: '길동짱',
        matchCount: 1,
        startPoint: 'SOSA_ST',
        endPoint: 'GURO_ST',
        recruitSize: 3,
        currentSize: 2,
        status: 'WAITING',
        departAt: '2025-07-20T08:00:00',
        createdTime: '2025-07-18T22:00:00',
      },
      {
        roomId: 102,
        hostId: 11,
        hostName: '이영희',
        hostNickname: '영희캡틴',
        matchCount: 2,
        startPoint: 'BUCHEON_ST',
        endPoint: 'SINDORIM_ST',
        recruitSize: 4,
        currentSize: 4,
        status: 'MATCHED',
        departAt: '2025-07-20T09:00:00',
        createdTime: '2025-07-17T11:30:00',
      },
    ],
    totalPages: 1,
    totalElements: 2,
    currentPage: 0,
    size: 10,
    hasNext: false,
  },
};

// ✅ 3. ChatRoomDetailResponse
export const mockChatRoomDetail: ChatRoomDetailResponse = {
  success: true,
  code: 'CHAT_ROOM_DETAIL_MOCK_SUCCESS',
  message: '목 채팅방 상세 정보 조회 성공',
  data: {
    currentSize: 2,
    recruitSize: 3,
    roomStatus: 'WAITING',
    hostEmail: 'host@example.com',
    hostNickname: '길동짱',
    participantEmails: ['hong@example.com', 'kim@example.com'],
    participantNicknames: ['홍길동', '김철수'],
    startPoint: 'SOSA_ST',
    endPoint: 'GURO_ST',
    departAt: '2025-07-20T08:00:00',
  },
};
