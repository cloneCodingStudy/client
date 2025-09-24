"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("동네생활");

  const posts = [
    {
      id: 1,
      title: "고양이 찾아요",
      content: "고양이 잃어버렸어요ㅜㅜㅜ",
      date: "2025-09-10",
      likes: 120,
      comments: 4,
      image: "/images/공구.jpg",
    },
    {
      id: 2,
      title: "고양이 찾아요",
      content: "고양이 잃어버렸어요ㅜㅜㅜ",
      date: "2025-09-09",
      likes: 3,
      comments: 1,
      image: null,
    },
  ];

  const currentTown = "경기도 용인시 수지구 성복동";
  const tabs = [
    "인기글 🔥",
    "전체",
    "동네생활",
    "꿀팁",
    "반려동물 🐈",
    "붕어빵 위치",
    "분실물 찾아요",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* 검색창 */}
      <div className=" mx-auto mb-10 relative">
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="w-full px-6 py-4 text-lg border border-[var(--color-border)] rounded-full 
                     focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 
                     focus:ring-[var(--color-primary)]/20 bg-white shadow-sm"
        />
        <button
          className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 
                           px-6 py-2 rounded-full"
        >
          검색
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          {currentTown} {activeTab}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          이웃들과 소통하며 다양한 커뮤니티 소식을 확인하세요.
        </p>
      </div>

      {/* 카테고리 버튼 */}
      <div className="grid grid-cols-3 gap-2 md:flex md:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border text-sm transition cursor-pointer ${
              activeTab === tab
                ? "bg-primary-purple text-white border-[var(--color-primary)]"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* sort */}
      <div className="flex justify-end mb-4">
        <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
          <option>최신순</option>
          <option>인기순</option>
          <option>댓글많은순</option>
        </select>
      </div>

      {/* 게시글 */}
      <div className="flex flex-col divide-y divide-gray-200">
        {posts.map((post) => (
          <div
            key={post.id}
            className="py-4 flex justify-between gap-4 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{post.title}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span>{post.date}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4 text-gray-400" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatBubbleOvalLeftIcon className="w-4 h-4 text-gray-400" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 썸네일*/}
            {post.image && (
              <div className="w-20 h-20 relative rounded-lg overflow-hidden mr-5 flex-shrink-0">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
