import { Client, StompSubscription } from "@stomp/stompjs";

class ChatSocketService {
  private client: Client | null = null;
  private notificationCallbacks: Set<(msg: any) => void> = new Set();
  private isSubscribedNotifications: boolean = false;

  connect(token: string, onConnectSuccess?: () => void) {
    if (this.client?.active) {
      if (this.client.connected) {
        this.setupNotificationSubscription();
        onConnectSuccess?.();
      }
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws");
    const connectionUrl = `${apiBaseUrl}/api/ws-stomp?token=${encodeURIComponent(token)}`;

    this.client = new Client({
      brokerURL: connectionUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("STOMP Connected");
        this.setupNotificationSubscription();
        onConnectSuccess?.(); 
      },
      onDisconnect: () => {
        console.log("STOMP Disconnected");
        this.isSubscribedNotifications = false;
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers['message']);
      }
    });

    this.client.activate();
  }

  private setupNotificationSubscription() {
    if (this.client?.connected && !this.isSubscribedNotifications) {
      this.client.subscribe("/user/queue/notifications", (message) => {
        const data = JSON.parse(message.body);
        this.notificationCallbacks.forEach(cb => cb(data));
      });
      this.isSubscribedNotifications = true;
    }
  }

  addNotificationHandler(callback: (msg: any) => void) {
    this.notificationCallbacks.add(callback);
    return () => {
      this.notificationCallbacks.delete(callback);
    };
  }

  subscribe(topic: string, callback: (msg: any) => void): StompSubscription | null {
    if (!this.client?.connected) return null;
    return this.client.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  }

  sendMessage(payload: any) {
    if (this.client?.connected) {
      this.client.publish({
        destination: "/app/chat/sendMessage",
        body: JSON.stringify(payload),
      });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isSubscribedNotifications = false;
    }
  }
}

export const chatSocketService = new ChatSocketService();