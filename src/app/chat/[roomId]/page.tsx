"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useChat } from "@/hooks/useChat";
import { chatService } from "@/services/chatService";
import { MessageResponse } from "@/types/chat";
import { PaperAirplaneIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import useUserStore from "@/store/useUserStore";

export default function ChatDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user: myInfo } = useUserStore();

  const rawRoomId = params?.roomId;
  const roomId = rawRoomId ? parseInt(rawRoomId as string) : 0;

  const opponentName = searchParams.get("opponent") || "상대방";
  const roomTitle = searchParams.get("title") || "채팅방";
  const opponentEmail = searchParams.get("email") || ""; 

  const [history, setHistory] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // 1. 초기 소켓 연결
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !chatService.isConnected()) {
      chatService.connect(token);
    }
  }, []);

  // 2. 과거 내역 로드
  useEffect(() => {
    if (!roomId || !myInfo) return;
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms/${roomId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data?.content || response.data;
        if (Array.isArray(data)) {
            setHistory([...data].reverse());
        }
      } catch (e) { console.error("히스토리 로드 실패:", e); }
    };
    fetchHistory();
  }, [roomId, myInfo]);

  // 3. 웹소켓 실시간 훅
  const { messages: realtimeMessages, send } = useChat(roomId, myInfo?.email || "", opponentEmail);

  // 4. 상태 모니터링
  useEffect(() => {
    const interval = setInterval(() => setIsSocketConnected(chatService.isConnected()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 5. 스크롤
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, realtimeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSocketConnected || !inputValue.trim()) return;
    send(inputValue);
    setInputValue("");
  };

  // [중요] 비교 함수: 이메일 형식이 미세하게 다를 경우를 대비
  const checkIsMe = (senderEmail: string | undefined) => {
    if (!senderEmail || !myInfo?.email) return false;
    return senderEmail.trim().toLowerCase() === myInfo.email.trim().toLowerCase();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto bg-white border rounded-xl shadow-sm mt-4">
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <button onClick={() => router.back()}><ChevronLeftIcon className="w-6 h-6 text-gray-600" /></button>
        <div className="flex-1">
          <h2 className="font-bold">{opponentName}</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-[10px] text-gray-400">{isSocketConnected ? "연결됨" : "연결 시도 중..."}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {history.map((msg, idx) => (
          <MessageBubble 
            key={msg.messageId || `hist-${idx}`} 
            content={msg.content} 
            isMe={checkIsMe(msg.senderName)}
            time={msg.sendTime} 
          />
        ))}
        {realtimeMessages.map((msg, idx) => {
          console.log("비교 시작:", msg.sender, myInfo?.email);

          const isMe = String(msg.sender).trim().toLowerCase() === String(myInfo?.email).trim().toLowerCase();

          return (
            <MessageBubble 
              key={`real-${idx}`} 
              content={msg.content} 
              isMe={isMe} 
              time={msg.time} 
            />
          );
        })}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isSocketConnected ? "메시지를 입력하세요..." : "연결 중..."}
          className="flex-1 border rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button type="submit" className={`p-2.5 rounded-full text-white ${isSocketConnected ? 'bg-primary-purple' : 'bg-gray-300'}`}>
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

function MessageBubble({ content, isMe, time }: { content: string; isMe: boolean; time?: string }) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
        isMe ? "bg-primary-purple text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
      }`}>
        <p className="break-all whitespace-pre-wrap">{content}</p>
        <span className="text-[10px] mt-1 block opacity-70">
          {time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "방금"}
        </span>
      </div>
    </div>
  );
}