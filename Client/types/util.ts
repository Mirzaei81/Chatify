export interface IMessage {
  author: string,
  message_body: string,
  url: string,
  created_at: string
}
export interface IRoom {
  age: number | null;
  icon: string | null;
  id: string;
  user_name: string;
  room: {
    created_at: string | null;
    creator: string;
    Icon: string | null;
    id: string;
    members: number | null;
    name: string;
  }[];
}
