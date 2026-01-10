"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { MagnifyingGlassIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { ChatRoomResponse } from "@/types/chat";

export default function ChatListPage() {
  const [rooms, setRooms] = useState<ChatRoomResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
        const response = await axios.get(`${apiUrl}/chat/rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(response.data);
      } catch (error) {
        console.error("채팅방 목록을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[600px] flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">전체 채팅</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-400">목록을 불러오는 중...</div>
        ) : rooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400 py-20">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4 opacity-20" />
            <p>아직 진행 중인 채팅이 없어요.</p>
          </div>
        ) : (
          rooms.map((room) => (
            <Link
              key={room.roomId}
              href={`/chat/${room.roomId}?opponent=${encodeURIComponent(room.opponentNickname)}&title=${encodeURIComponent(room.title)}&email=${room.opponentEmail}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                {room.opponentNickname?.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 truncate">{room.opponentNickname}</span>
                  <span className="text-xs text-gray-400">
                    {room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{room.lastMessage || "대화 내용이 없습니다."}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}