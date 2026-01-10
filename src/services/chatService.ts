// src/services/chatService.ts
import { Client } from "@stomp/stompjs";

class ChatService {
  private client: Client | null = null;
  private messageCallbacks: Set<(msg: any) => void> = new Set();
  private notificationCallbacks: Set<(msg: any) => void> = new Set();
  private isSubscribed: boolean = false;

  connect(token: string) {
    if (this.client?.active) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws");
    const connectionUrl = `${apiBaseUrl}/ws-stomp?token=${encodeURIComponent(token)}`;

    this.client = new Client({
      brokerURL: connectionUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str), 
      onConnect: () => {
        console.log("STOMP Connected");
        
        if (this.client?.connected && !this.isSubscribed) {
          this.client.subscribe("/user/queue/messages", (message) => {
            console.log("[Raw Message Received]:", message.body);
            const data = JSON.parse(message.body);
            this.messageCallbacks.forEach(cb => cb(data));
          });

          this.client.subscribe("/user/queue/notifications", (message) => {
            const data = JSON.parse(message.body);
            this.notificationCallbacks.forEach(cb => cb(data));
          });

          this.isSubscribed = true;
          console.log("구독 성공: /user/queue/messages");
        }
      },
      onDisconnect: () => {
        this.isSubscribed = false;
      }
    });

    this.client.activate();
  }

  addMessageHandler(callback: (msg: any) => void) {
    this.messageCallbacks.add(callback);
    return () => { this.messageCallbacks.delete(callback); };
  }

  addNotificationHandler(callback: (msg: any) => void) {
    this.notificationCallbacks.add(callback);
    return () => { this.notificationCallbacks.delete(callback); };
  }

  sendMessage(chatMessage: any) {
    if (this.isConnected()) {
      console.log("메시지 전송 시작:", chatMessage);
      this.client?.publish({
        destination: "/app/chat/sendMessage",
        body: JSON.stringify(chatMessage),
      });
    }
  }

  isConnected(): boolean {
    return !!this.client && this.client.connected;
  }
}

export const chatService = new ChatService();