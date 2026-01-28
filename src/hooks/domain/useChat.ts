import { useState, useEffect, useCallback } from "react";
import { chatSocketService } from "@/services/chatSocketService";
import { chatService } from "@/services/chatService";

export const useChat = (roomId: number, myEmail: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !roomId) return;

    chatService.getMessages(roomId).then((history) => {
      if (history) setMessages(history);
    });

    let subscription: any = null;

    const startSubscription = () => {
      const topic = `/topic/chat/${roomId}`;
      subscription = chatSocketService.subscribe(topic, (data) => {
        if (data.senderEmail !== myEmail) {
          setMessages((prev) => [...prev, data]);
        }
      });
      if (subscription) setIsReady(true);
    };

    chatSocketService.connect(token, startSubscription);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      setIsReady(false);
    };
  }, [roomId, myEmail]);

  const send = useCallback((content: string) => {
    if (!content.trim() || !isReady) return;

    const payload = { roomId, content };
    chatSocketService.sendMessage(payload);

    const myNewMsg = {
      content,
      senderEmail: myEmail,
      sendTime: new Date().toISOString(),
      roomId
    };
    
    setMessages((prev) => [...prev, myNewMsg]);
  }, [roomId, myEmail, isReady]);

  return { messages, send, isReady };
};