"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useChat } from "@/hooks/useChat";
import { chatService } from "@/services/chatService";
import { MessageResponse } from "@/types/chat";
import { PaperAirplaneIcon, ChevronLeftIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";

export default function ChatDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user: myInfo } = useUserStore();

  // 1. URL 파라미터 및 쿼리 정보 추출
  const rawRoomId = params?.roomId;
  const roomId = rawRoomId ? parseInt(rawRoomId as string) : 0;
  
  const opponentName = searchParams.get("opponent") || "상대방";
  const roomTitle = searchParams.get("title") || "채팅방";
  const opponentEmail = searchParams.get("email") || ""; 
  
  // 결제 페이지 이동을 위해 필요한 상품 ID
  const productId = searchParams.get("productId");

  const [history, setHistory] = useState<MessageResponse[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // 2. 초기 소켓 연결
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !chatService.isConnected()) {
      chatService.connect(token);
    }
  }, []);

  // 3. 과거 대화 내역 로드
  useEffect(() => {
  if (!roomId || !myInfo) return;
  
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiResponse = response.data;
      const sliceData = apiResponse.data; 

      if (sliceData && Array.isArray(sliceData.content)) {
        setHistory([...sliceData.content].reverse());
      } else if (Array.isArray(sliceData)) {
        setHistory([...sliceData].reverse());
      }
    } catch (e) { 
      console.error("히스토리 로드 실패:", e); 
    }
  };
  fetchHistory();
}, [roomId, myInfo]);

  // 4. 웹소켓 실시간 메시지 훅
  const { messages: realtimeMessages, send } = useChat(roomId, myInfo?.email || "", opponentEmail);

  // 5. 소켓 연결 상태 실시간 모니터링
  useEffect(() => {
    const interval = setInterval(() => setIsSocketConnected(chatService.isConnected()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 6. 새 메시지 수신 시 스크롤 하단 고정
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, realtimeMessages]);

  // 7. 안심 결제 페이지(/rent/[id])로 이동
  const handleGoToRent = () => {
    if (!productId) {
      toast.error("상품 정보가 없어 결제 페이지로 이동할 수 없습니다.");
      return;
    }
    router.push(`/rent/${productId}`);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSocketConnected || !inputValue.trim()) return;
    send(inputValue);
    setInputValue("");
  };

  const checkIsMe = (senderEmail: string | undefined) => {
    console.log("비교 대상:", senderEmail, "내 이메일:", myInfo?.email);

    if (!senderEmail || !myInfo?.email) return false;
    
    return senderEmail.trim().toLowerCase() === myInfo.email.trim().toLowerCase();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto bg-white border rounded-xl shadow-sm mt-4 overflow-hidden">
      {/* 상단 헤더 영역 */}
      <div className="flex items-center gap-4 px-6 py-4 border-b bg-white z-10">
        <button onClick={() => router.back()} className="hover:bg-gray-100 p-1 rounded-full transition">
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-800">{opponentName}</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className="text-[10px] text-gray-400">
              {roomTitle} · {isSocketConnected ? "실시간 연결됨" : "연결 시도 중..."}
            </p>
          </div>
        </div>

        {/* 결제 페이지 이동 버튼 */}
        {productId && (
          <button 
            onClick={handleGoToRent}
            className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md active:scale-95"
          >
            <CreditCardIcon className="w-4 h-4" />
            안심 결제하기
          </button>
        )}
      </div>

      {/* 채팅 메시지 표시 영역 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {history.map((msg, idx) => (
          <MessageBubble 
            key={msg.messageId || `hist-${idx}`} 
            content={msg.content} 
            isMe={checkIsMe(msg.senderEmail)}
            time={msg.sendTime} 
          />
        ))}
        {realtimeMessages.map((msg, idx) => (
          <MessageBubble 
            key={`real-${idx}`} 
            content={msg.content} 
            isMe={String(msg.senderEmail).trim().toLowerCase() === String(myInfo?.email).trim().toLowerCase()} 
            time={msg.time} 
          />
        ))}
      </div>

      {/* 메시지 입력 폼 */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isSocketConnected ? "메시지를 입력하세요..." : "연결 대기 중..."}
          className="flex-1 border rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button 
          type="submit" 
          disabled={!isSocketConnected || !inputValue.trim()}
          className={`p-2.5 rounded-full text-white transition-all ${
            isSocketConnected && inputValue.trim() ? 'bg-primary-purple' : 'bg-gray-200'
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

/**
 * 개별 메시지 말풍선 컴포넌트
 */
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