import { useState, useEffect, useCallback } from "react";
import { chatService } from "@/services/chatService";

export const useChat = (roomId: number, myEmail: string, receiverEmail: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !roomId) return;

    chatService.connect(token);

    let subscription: any = null;
    const checkAndSubscribe = setInterval(() => {
        if (chatService.isConnected()) {
            const topic = `/topic/chat/${roomId}`; 
            
            subscription = chatService.subscribe(topic, (data) => {
                console.log("채팅방 메시지 수신:", data);
                if (data.senderEmail !== myEmail) {
                    setMessages((prev) => [...prev, data]);
                }
            });

            if (subscription) {
                setIsReady(true);
                clearInterval(checkAndSubscribe);
            }
        }
    }, 500);

    return () => {
      if (subscription) {
        console.log("구독 해제");
        subscription.unsubscribe();
      }
      clearInterval(checkAndSubscribe);
    };
  }, [roomId, myEmail]);

  const send = useCallback((content: string) => {
    if (!content.trim() || !isReady) {
      console.warn("전송 불가: 연결 대기 중이거나 내용이 비어있음");
      return;
    }

    const payload = { 
      roomId, 
      content,
    };
    
    chatService.sendMessage(payload);
    console.log(myEmail);
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