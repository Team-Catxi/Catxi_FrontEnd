import type { Client, Subscription } from "webstomp-client";
import {
  chatTopic,
  readyTopic,
  systemMessageTopic,
  participantsTopic,
  deletedTopic,
  mapTopic, 
} from "./topics.ts";

export interface SubRefs {
  chat: Subscription | null;
  ready: Subscription | null;
  system: Subscription | null;
  participants: Subscription | null;
  deleted: Subscription | null;
  map: Subscription | null;
}

export const cleanupSubscriptions = (refs: SubRefs) => {
  refs.chat?.unsubscribe();
  refs.ready?.unsubscribe();
  refs.system?.unsubscribe();
  refs.participants?.unsubscribe();
  refs.deleted?.unsubscribe();
  refs.map?.unsubscribe();

  refs.chat = null;
  refs.ready = null;
  refs.system = null;
  refs.participants = null;
  refs.deleted = null;
  refs.map = null; 
};

export const setupSubscriptions = (
  client: Client,
  roomId: number,
  jwtToken: string,
  handlers: {
    chat: (data: any) => void;
    ready?: (data: any) => void;
    system?: (data: any) => void;
    participants?: (data: any) => void;
    deleted?: (data: any) => void;
    map?: (data: any) => void; 
  }
): SubRefs => {
  return {
    chat: client.subscribe(chatTopic(roomId), (msg) => handlers.chat(JSON.parse(msg.body)), {
      Authorization: `Bearer ${jwtToken}`,
    }),
    ready: handlers.ready
      ? client.subscribe(readyTopic(roomId), (msg) => handlers.ready!(JSON.parse(msg.body)), {
          Authorization: `Bearer ${jwtToken}`,
        })
      : null,
    system: handlers.system
      ? client.subscribe(systemMessageTopic(roomId), (msg) => handlers.system!(JSON.parse(msg.body)), {
          Authorization: `Bearer ${jwtToken}`,
        })
      : null,
    participants: handlers.participants
      ? client.subscribe(participantsTopic(roomId), (msg) => handlers.participants!(JSON.parse(msg.body)), {
          Authorization: `Bearer ${jwtToken}`,
        })
      : null,
    deleted: handlers.deleted
      ? client.subscribe(deletedTopic(roomId), (msg) => handlers.deleted!(JSON.parse(msg.body)), {
          Authorization: `Bearer ${jwtToken}`,
        })
      : null,
    map: handlers.map
      ? client.subscribe(mapTopic(roomId), (msg) => handlers.map!(JSON.parse(msg.body)), {
          Authorization: `Bearer ${jwtToken}`,
        })
      : null, 
  };
};
