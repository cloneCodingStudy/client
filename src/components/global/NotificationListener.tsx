"use client";

import { useEffect, useRef } from "react";
import { chatSocketService } from "@/services/chatSocketService";
import { authService } from "@/services/AuthService";
import toast from "react-hot-toast";
import useUserStore from "@/store/useUserStore";

export default function NotificationListener() {
  const { user } = useUserStore();
  const isConnecting = useRef(false);

  useEffect(() => {
    if (!user) {
      chatSocketService.disconnect();
      return;
    }

    const startSocketConnection = async () => {
      let rawToken = localStorage.getItem("accessToken");
      if (!rawToken) return; 
      let token: string = rawToken

      const payload = authService.decodePayload(token);
      const isExpired = payload && payload.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("웹소켓 연결 전 토큰 만료 감지, 재발급 시도...");
        try {
          const newToken = await authService.reissue();
          if (newToken) {
            token = newToken;
            localStorage.setItem("accessToken", newToken);
          }
        } catch (error) {
          console.error("웹소켓 연결을 위한 토큰 재발급 실패");
          return;
        }
      }

      if (!isConnecting.current) {
        isConnecting.current = true;
        chatSocketService.connect(token, () => {
          isConnecting.current = false;
        });
      }
    };

    startSocketConnection();

    const unsubscribe = chatSocketService.addNotificationHandler((data) => {
      if (data.sender === user.email) return;

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  {data.senderName?.[0] || 'N'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">{data.senderName || '새 메시지'}</p>
                <p className="mt-1 text-sm text-gray-500 truncate">{data.content}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-purple-600 hover:text-purple-500 focus:outline-none"
            >
              닫기
            </button>
          </div>
        </div>
      ), { position: "top-right", duration: 4000 });
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return null; 
}