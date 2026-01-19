import { Client, StompSubscription } from "@stomp/stompjs";

class ChatService {
  private client: Client | null = null;
  private notificationCallbacks: Set<(msg: any) => void> = new Set();
  private isSubscribedNotifications: boolean = false;

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
        
        if (this.client?.connected && !this.isSubscribedNotifications) {
          this.client.subscribe("/user/queue/notifications", (message) => {
            const data = JSON.parse(message.body);
            console.log("새 알림 도착:", data);
            this.notificationCallbacks.forEach(cb => cb(data));
          });
          this.isSubscribedNotifications = true;
        }
      },
      onDisconnect: () => {
        this.isSubscribedNotifications = false;
      }
    });

    this.client.activate();
  }

  addNotificationHandler(callback: (msg: any) => void) {
    this.notificationCallbacks.add(callback);
    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  subscribe(topic: string, callback: (msg: any) => void): StompSubscription | null {
    if (!this.client || !this.client.connected) return null;
    return this.client.subscribe(topic, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  }

  sendMessage(chatMessage: any) {
    if (this.isConnected()) {
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