"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { PaperAirplaneIcon, ChevronLeftIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import { useChat } from "@/hooks/domain/useChat";
import useUserStore from "@/store/useUserStore";

export default function ChatDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user: myInfo } = useUserStore();

  const roomId = Number(params?.roomId) || 0;
  const opponentName = searchParams.get("opponent") || "상대방";
  const roomTitle = searchParams.get("title") || "채팅방";
  const productId = searchParams.get("productId");

  const [inputValue, setInputValue] = useState("");

  const { messages, send, isReady } = useChat(roomId, myInfo?.email || "");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady || !inputValue.trim()) return;
    send(inputValue);
    setInputValue("");
  };

  const checkIsMe = (senderEmail: string | undefined) => {
    return senderEmail?.trim().toLowerCase() === myInfo?.email?.trim().toLowerCase();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto bg-white border rounded-xl shadow-sm mt-4 overflow-hidden">
      {/* 헤더 영역 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b bg-white z-10">
        <button onClick={() => router.back()} className="hover:bg-gray-100 p-1 rounded-full transition">
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">{opponentName}</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-[10px] text-gray-400">
              {roomTitle} · {isReady ? "실시간 연결됨" : "연결 대기 중..."}
            </p>
          </div>
        </div>
        {productId && (
          <button 
            onClick={() => router.push(`/rent/${productId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white text-xs font-bold rounded-lg hover:bg-opacity-90 shadow-md active:scale-95"
          >
            <CreditCardIcon className="w-4 h-4" />
            안심 결제하기
          </button>
        )}
      </div>

      {/* 메시지 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <MessageBubble 
            key={msg.messageId || idx} 
            content={msg.content} 
            isMe={checkIsMe(msg.senderEmail)}
            time={msg.sendTime || msg.time} 
          />
        ))}
      </div>

      {/* 입력 영역 */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isReady ? "메시지를 입력하세요..." : "연결 대기 중..."}
          className="flex-1 border rounded-full px-5 py-2 text-sm focus:ring-2 focus:ring-purple-200 outline-none"
        />
        <button 
          type="submit" 
          disabled={!isReady || !inputValue.trim()}
          className={`p-2.5 rounded-full text-white transition-all ${isReady && inputValue.trim() ? 'bg-primary-purple' : 'bg-gray-200'}`}
        >
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