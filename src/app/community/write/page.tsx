"use client";
import ImageUpload from "@/components/ImageUpload";
import { createCommunityPost } from "@/data/actions/community.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useLocationStore from "@/store/useLocationStore"; // 위치 스토어 추가

export default function CommunityPostWrite() {
  const router = useRouter();
  const { location } = useLocationStore(); // 현재 위치 정보 가져오기

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const max = 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!category) {
      toast.error("게시판을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    try {
      const res = await createCommunityPost({
        title,
        content,
        category,
        imageUrls, 
        location: location?.neighborhood || "알 수 없는 동네", 
        lat: location?.lat, 
        lng: location?.lng, 
      });

      if (res) {
        toast.success("게시글이 등록되었습니다.");
        router.push("/community");
      } else {
        toast.error("게시글 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* 현재 위치 표시 (선택 사항) */}
      <div className="text-xs text-purple-600 font-semibold mb-2 px-1">
        📍 현재 위치: {location?.neighborhood || "위치 정보 없음"}
      </div>
      
      <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg mb-8">
        ⚠️ 건전한 커뮤니티 환경을 위해 일부 글은 운영 정책에 따라 노출이 제한되거나 삭제될 수 있습니다.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 카테고리 선택 */}
        <div className="flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm w-1/2 focus:ring-purple-500 focus:outline-none"
          >
            <option value="" disabled hidden>
              게시판을 선택해주세요 (필수)
            </option>
            <option value="INFO">동네생활</option>
            <option value="TIP">꿀팁</option>
            <option value="PET">반려동물 🐈</option>
            <option value="BBANG">붕어빵 위치</option>
            <option value="LOST">분실물</option>
          </select>
        </div>

        {/* 제목 */}
        <div className="flex items-center justify-between border-b border-gray-300 py-3 my-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            maxLength={60}
            className="w-full text-lg focus:outline-none bg-transparent"
          />
          <span className="text-sm text-gray-400 ml-2 whitespace-nowrap">
            {title.length}/{max}
          </span>
        </div>

        {/* 내용 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요."
            rows={12}
            className="resize-none w-full rounded-lg p-4 text-sm focus:outline-none bg-gray-50/30"
          />
        </div>

        {/* 사진 업로드 */}
        <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

        {/* 작성 버튼 */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="cursor-pointer px-10 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-bold shadow-lg shadow-purple-100"
          >
            글 올리기
          </button>
        </div>
      </form>
    </div>
  );
}