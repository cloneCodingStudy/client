import { useState, useEffect, useCallback } from "react";
import { chatService } from "@/services/chatService";
import { ChatMessage } from "@/types/chat";

export const useChat = (roomId: number, myEmail: string, receiverEmail: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isReady, setIsReady] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !roomId || !myEmail) return;

    chatService.connect(token);

    const unsubscribe = chatService.addMessageHandler((newMsg: ChatMessage) => {
      if (String(newMsg.roomId) === String(roomId)) {
        if (newMsg.sender !== myEmail) {
          setMessages((prev) => [...prev, { ...newMsg, time: new Date().toISOString() }]);
        }
      }
    });

    const checkConnection = setInterval(() => {
      if (chatService.isConnected()) {
        setIsReady(true);
        clearInterval(checkConnection);
      }
    }, 500);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, [roomId, myEmail]);

  const send = (content: string) => {
    if (!content.trim() || !isReady) {
      console.warn("⚠️ 아직 구독이 완료되지 않았습니다.");
      return;
    }

    const payload = { roomId, sender: myEmail, receiver: receiverEmail, content };
    chatService.sendMessage(payload);
    
    setMessages((prev) => [...prev, { ...payload, time: new Date().toISOString() }]);
  };

  return { messages, send, isReady };
};