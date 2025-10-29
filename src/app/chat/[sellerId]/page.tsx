"use client";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ChatDetailPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "seller", content: "안녕하세요!", time: "오전 10:12" },
    { id: 2, sender: "me", content: "안녕하세요!", time: "오전 10:12" },
  ]);
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: "me",
      content: message,
      time: "방금전",
    };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mt-8 max-w-6xl mx-auto shadow-sm">
      {/* 목록창 */}
      <div className="w-[340px] border-r border-gray-200 bg-white flex flex-col">
        <div className="flex gap-2 p-4 border-b border-gray-100">
          {["전체", "안 읽음", "거래 중", "거래완료"].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-primary-purple hover:text-white active:bg-primary-purple active:text-white transition"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 검색창 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="검색해 보세요."
            className="flex-1 outline-none text-sm placeholder-gray-400"
          />
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          메시지가 없어요
        </div>
      </div>

      {/* 채팅창 */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
              프사
            </div>
            <div>
              <p className="font-semibold text-gray-800">상대방별명</p>
            </div>
          </div>
          <button className="text-sm text-gray-400 hover:text-gray-600 transition">⋮</button>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              메시지로 거래하고 싶은 상대방과 대화를 나눌 수 있어요.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "me"
                      ? "bg-primary-purple text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  <div
                    className={`text-[10px] mt-1 ${
                      msg.sender === "me" ? "text-gray-200" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 입력창 */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 border-t border-gray-200 bg-white px-4 py-3"
        >
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            type="submit"
            className="bg-primary-purple text-white p-2 rounded-full hover:bg-primary-purple-alt transition"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
