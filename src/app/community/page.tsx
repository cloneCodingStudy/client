"use client";

import { getCommunityPosts, searchCommunityPosts } from "@/data/actions/community.api";
import useUserStore from "@/store/useUserStore";
import { CommunityPost, CommunityCategory } from "@/types/community";
import { HeartIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import useLocationStore from "@/store/useLocationStore"; 

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<CommunityCategory>("ALL");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user } = useUserStore();
  const { location } = useLocationStore(); 
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const positionParams = (location?.lat !== undefined && location?.lng !== undefined) 
        ? {
            lat: location.lat,
            lng: location.lng,
            distance: 3
          } 
        : undefined;

      const data = await getCommunityPosts(0, 20, positionParams);
      
      if (data && data.content) {
        setPosts(data.content);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("게시글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 카테고리 필터링 (클라이언트 사이드)
  const filteredPosts = activeTab === "ALL" 
    ? posts 
    : posts.filter(post => post.category === activeTab);

  const handleWriteClick = () => {
    if (!user) {
      toast.error("로그인 후 글을 작성할 수 있습니다.");
      router.push(`/login?returnUrl=${encodeURIComponent("/community/write")}`);
      return;
    }
    router.push("/community/write");
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchPosts();
      return;
    }
    setLoading(true);
    const results = await searchCommunityPosts(searchKeyword);
    if (results) setPosts(results);
    setLoading(false);
  };

  const tabs: { label: string; value: CommunityCategory }[] = [
    { label: "전체", value: "ALL" },
    { label: "인기글 🔥", value: "HOT" },
    { label: "동네생활", value: "INFO" },
    { label: "꿀팁", value: "TIP" },
    { label: "반려동물 🐈", value: "PET" },
    { label: "붕어빵 위치", value: "BBANG" },
    { label: "분실물 찾아요", value: "LOST" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* 검색창 */}
      <div className="mx-auto mb-10 relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="동네 소식을 검색해보세요"
          className="w-full px-6 py-4 text-lg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white shadow-sm"
        />
        <button onClick={handleSearch} className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-purple-600 font-bold">
          검색
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">
          <span className="text-purple-600">{location?.neighborhood || "전체 지역"}</span> {tabs.find(t => t.value === activeTab)?.label}
        </h2>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.value
                ? "bg-purple-600 text-white border-purple-600 shadow-md"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 작성 버튼 */}
      <div className="flex justify-end my-8">
        <button onClick={handleWriteClick} className="px-6 py-2.5 rounded-full bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-100">
          + 글 작성하기
        </button>
      </div>

      {/* 게시글 리스트 */}
      <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100">
        {loading ? (
          <div className="py-20 text-center text-gray-400 animate-pulse">데이터를 가져오는 중...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">게시글이 없습니다.</div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/community/${post.id}`)}
              className="py-6 flex justify-between gap-6 hover:bg-gray-50/50 transition cursor-pointer px-2 rounded-xl group"
            >
              <div className="flex-1">
                <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded mb-2 inline-block">
                  {tabs.find(t => t.value === post.category)?.label || "자유"}
                </span>
                <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-purple-600 transition">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-4">
                  <span className="font-medium text-gray-500">{post.location || "지역 정보 없음"}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls[0].imageUrl && (
                <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
                    src={post.imageUrls[0].imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}