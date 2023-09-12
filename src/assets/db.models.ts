/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface user {
  username: string,
  ticket: number,
  status: boolean
}

export interface ContextRes {
  update: Update;
  tg: Telegram;
  botInfo: BotInfo;
  state: any;
  startPayload: string;
}

export interface Update {
  update_id: number;
  message: Message;
}

export interface Message {
  message_id: number;
  from: any;
  chat: any;
  date: number;
  text: string;
  entities: any[];
}

export interface Telegram {
  token: string;
  response: any;
  options: {
    apiRoot: string;
    apiMode: string;
    webhookReply: boolean;
    agent: any[];
    attachmentAgent: any;
  };
}

export interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}
