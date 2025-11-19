"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { getProduct, updateProduct } from "@/data/actions/products.api";
import ImageUpload from "@/components/ImageUpload";

export default function ProductEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  // 기존 상품 데이터
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const categories = [
    { label: "생활용품", value: "LIVING" },
    { label: "의류/잡화", value: "FASHION" },
    { label: "육아", value: "BABY" },
    { label: "레저/취미", value: "LEISURE" },
    { label: "반려동물", value: "PET" },
    { label: "자동차/정비", value: "CAR" },
    { label: "전자기기", value: "DEVICE" },
    { label: "수리/공구/인테리어", value: "TOOL" },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const data = await getProduct(Number(id));
      if (!data) {
        toast.error("상품 정보를 불러오지 못했습니다.");
        router.push("/mypage/products");
        return;
      }

      setTitle(data.title);
      setCategory(data.category);
      setPrice(String(data.price));
      setLocation(data.location);
      setDescription(data.description);
      setImageUrls([data.image]);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">상품 정보를 불러오는 중...</p>;

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return toast.error("카테고리를 선택해주세요.");
    if (!title.trim()) return toast.error("상품명을 입력해주세요.");
    if (!price.trim()) return toast.error("가격을 입력해주세요.");
    if (!location.trim()) return toast.error("위치를 입력해주세요.");
    if (!description.trim()) return toast.error("설명을 입력해주세요.");

    const payload = {
      title,
      category,
      price: Number(price),
      location,
      description,
      imageUrls,
    };

    const ok = await updateProduct(Number(id), payload);

    if (ok) {
      toast.success("상품이 수정되었습니다!");
      router.push(`/products/${id}`);
    } else {
      toast.error("수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-sm text-gray-600 p-4 rounded-lg mb-8">✨ 상품 정보를 수정하세요.</div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 카테고리 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-full focus:ring-[var(--color-primary)] focus:outline-none"
        >
          <option value="" disabled hidden>
            카테고리를 선택해주세요 (필수)
          </option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* 상품명 */}
        <div className="flex items-center justify-between border-b border-gray-300 py-3 my-2">
          <input
            type="text"
            placeholder="상품명을 입력해주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg focus:outline-none bg-transparent"
          />
        </div>

        {/* 가격 */}
        <div className="flex items-center justify-between border-b border-gray-300 py-3 my-2">
          <input
            type="number"
            placeholder="대여 가격 (원)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full text-lg focus:outline-none bg-transparent"
          />
        </div>

        {/* 위치 */}
        <div className="flex items-center justify-between border-b border-gray-300 py-3 my-2">
          <input
            type="text"
            placeholder="거래 위치 (예: 성북동)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-lg focus:outline-none bg-transparent"
          />
        </div>

        <textarea
          placeholder="상품 설명을 입력해주세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-lg p-4 text-sm border border-gray-300 focus:outline-none"
        />

        {/* 사진 첨부 */}
        <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

        {/* 버튼 */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="cursor-pointer px-6 py-2 bg-[var(--color-primary-purple)] text-white rounded-lg hover:bg-[var(--color-hover-purple)] transition font-semibold"
          >
            상품 수정하기
          </button>
        </div>
      </form>
    </div>
  );
}
