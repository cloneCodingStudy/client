"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useProducts } from "@/hooks/domain/useProducts";
import ImageUpload from "@/components/common/ImageUpload";
import MapModal from "@/components/common/mapModal";

export default function ProductNewPage() {
  const router = useRouter();
  
  const { createProduct, handleAnalyzeImage, loading: isActionLoading } = useProducts();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    location: "",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onAiAnalysis = async () => {
    if (imageUrls.length === 0) return toast.error("사진을 최소 한 장 등록해주세요.");

    setIsAnalyzing(true);
    const loadingToast = toast.loading("AI가 사진을 분석 중입니다...");

    try {
      const aiData = await handleAnalyzeImage(imageUrls[0]);
      if (aiData) {
        setFormData((prev) => ({
          ...prev,
          title: aiData.title || prev.title,
          price: aiData.price?.toString() || prev.price,
          description: `[상태: ${aiData.condition || "정보없음"}]\n${aiData.description || ""}`,
        }));
        toast.success("AI 초안이 완성되었습니다!", { id: loadingToast });
      }
    } finally {
      setIsAnalyzing(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) return toast.error("카테고리를 선택해주세요.");
    if (!formData.title.trim()) return toast.error("상품명을 입력해주세요.");
    if (!formData.price.trim()) return toast.error("가격을 입력해주세요.");
    if (!formData.location) return toast.error("거래 장소를 설정해주세요.");

    const payload = { 
      ...formData, 
      price: Number(formData.price), 
      latitude: coords?.lat, 
      longitude: coords?.lng, 
      imageUrls 
    };

    const resultId = await createProduct(payload);
    if (resultId) {
      router.push("/products/" + resultId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 relative">
      {/* 분석 중 로딩 오버레이 */}
      {isAnalyzing && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-purple-700 font-bold animate-pulse">✨ AI 분석 중...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">대여 상품 등록</h1>
        <p className="text-sm text-gray-500">사진을 올리고 AI 기능을 사용하면 정보를 자동으로 채워드려요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-md font-bold text-gray-700">상품 사진 (필수)</label>
            {imageUrls.length > 0 && (
              <button
                type="button"
                onClick={onAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-all disabled:opacity-50"
              >
                ✨ AI로 정보 자동채우기
              </button>
            )}
          </div>
          <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">카테고리</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">선택해주세요</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">대여 가격 (1일)</label>
            <input
              name="price"
              type="number"
              placeholder="0원"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">상품명</label>
          <input
            name="title"
            type="text"
            placeholder="상품명을 입력하세요"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none text-lg"
          />
        </div>

        <section className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <label className="text-sm font-bold text-purple-700 block mb-3">거래 희망 장소</label>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="w-full py-4 bg-white border-2 border-purple-200 border-dashed rounded-xl text-purple-600 hover:border-purple-400 transition-all flex items-center justify-center gap-2"
          >
            📍 <span className="font-semibold">{formData.location ? "장소 변경" : "지도로 선택하기"}</span>
          </button>
          {formData.location && (
            <div className="mt-3 bg-white/80 px-4 py-2 rounded-lg text-sm text-purple-800 font-medium border border-purple-100">
              ✅ {formData.location}
            </div>
          )}
        </section>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">상세 설명</label>
          <textarea
            name="description"
            placeholder="설명을 입력하세요..."
            value={formData.description}
            onChange={handleInputChange}
            rows={8}
            className="w-full resize-none rounded-xl p-4 text-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isActionLoading}
          className="w-full py-4 bg-purple-600 text-white rounded-xl text-lg font-bold hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isActionLoading ? "등록 중..." : "상품 등록하기"}
        </button>
      </form>

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onConfirm={() => setShowMapModal(false)}
        onLocationSelect={(address, lat, lng) => {
          setFormData(prev => ({ ...prev, location: address }));
          setCoords({ lat, lng });
        }}
        currentLocation={formData.location}
        initialCenter={coords || undefined}
      />
    </div>
  );
}