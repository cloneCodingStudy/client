export interface ChatMessage {
  roomId: number;    
  sender: string;    
  receiver: string;  
  content: string;
  id?: number;       
  time?: string;     
}

export interface MessageResponse {
  messageId: number;
  content: string;
  senderName: string;
  sendTime: string;
}

export interface ChatRoomResponse {
  roomId: number;
  title: string;
  lastMessage: string;
  lastMessageTime: string;
  opponentNickname: string;
}