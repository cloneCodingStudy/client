"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getCommunityPost, createCommunityComment } from "@/data/actions/community.api";
import { CommunityPost } from "@/types/community";
import useUserStore from "@/store/useUserStore";
import toast from "react-hot-toast";

export default function CommunityDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const { user } = useUserStore();

  // 상세조회
  const fetchPost = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getCommunityPost(Number(id));
    setPost(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // 댓글 작성
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }
    if (!commentInput.trim()) {
      toast.error("댓글을 입력해주세요.");
      return;
    }

    const success = await createCommunityComment(Number(id), commentInput);
    if (success) {
      toast.success("댓글이 등록되었습니다.");
      setCommentInput("");
      await fetchPost();
    } else {
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-400">불러오는 중...</p>;
  if (!post) return <p className="text-center mt-20 text-gray-400">게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <p className="font-semibold text-lg">{post.user[0]?.nickName}</p>
          <p className="text-sm text-gray-500">{post.createdAt}</p>
        </div>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

      {/* 본문 */}
      <div className="text-gray-800 whitespace-pre-line leading-relaxed mb-6">{post.content}</div>

      {/* 이미지 */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-10">
          {post.images.map((img) => (
            <div key={img.id} className="relative w-full h-56 rounded-lg overflow-hidden">
              <Image src={img.imageUrl} alt="첨부 이미지" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* 댓글 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">댓글</h2>

        {(!post.comments || post.comments.length === 0) && (
          <p className="text-gray-400 italic mb-6">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>
        )}

        {post.comments && post.comments.length > 0 && (
          <ul className="space-y-4 mb-6">
            {post.comments.map((comment) => (
              <li key={comment.id} className="border-b pb-3">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-gray-700">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}

        {/* 댓글 입력 */}
        <form onSubmit={handleComment} className="flex gap-2 mt-4">
          <input
            type="text"
            placeholder={`댓글을 입력하세요`}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-purple/40"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple-alt transition"
          >
            댓글 쓰기
          </button>
        </form>
      </section>
    </div>
  );
}
