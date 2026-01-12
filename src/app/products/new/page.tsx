"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createProduct, analyzeProductImage } from "@/data/actions/products.api";
import ImageUpload from "@/components/ImageUpload";
import MapModal from "@/components/mapModal";

export default function ProductNewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [description, setDescription] = useState("");
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

  const handleAiAnalysis = async () => {
    if (imageUrls.length === 0) {
      return toast.error("사진을 최소 한 장 등록해야 AI 분석이 가능합니다.");
    }

    setIsAnalyzing(true);
    const loadingToast = toast.loading("AI가 사진을 분석 중입니다. 최대 1분 정도 소요될 수 있습니다...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const aiData = await analyzeProductImage(imageUrls[0], controller.signal);

      if (aiData) {
        setTitle(aiData.title || "");
        setPrice(aiData.price?.toString() || "");
        const combinedDesc = `[상태: ${aiData.condition || "정보없음"}]\n${aiData.description || ""}`;
        setDescription(combinedDesc);

        toast.success("AI 초안 완성!", { id: loadingToast });
      } else {
        throw new Error("분석 데이터를 읽을 수 없습니다.");
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        toast.error("분석 시간이 너무 오래 걸려 중단되었습니다. 다시 시도해 주세요.", { id: loadingToast });
      } else {
        toast.error("분석 실패. 직접 입력 부탁드립니다.", { id: loadingToast });
      }
      console.error("AI Analysis Error:", err);
    } finally {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return toast.error("카테고리를 선택해주세요.");
    if (!title.trim()) return toast.error("상품명을 입력해주세요.");
    if (!price.trim()) return toast.error("가격을 입력해주세요.");
    if (!location) return toast.error("거래 장소를 설정해주세요.");
    if (!description.trim()) return toast.error("설명을 입력해주세요.");

    const payload = { title, category, price: Number(price), location, latitude: coords?.lat, longitude: coords?.lng, description, imageUrls };
    const result = await createProduct(payload);

    if (result) {
      toast.success("상품이 등록되었습니다!");
      router.push("/products/" + result);
    } else {
      toast.error("등록에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 relative">
      {/* 분석 중일 때 로딩 오버레이 */}
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
        <p className="text-sm text-gray-500">사진을 올리고 AI 기능을 사용하면 제목과 설명을 자동으로 써드려요.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. 사진 업로드 섹션 (최상단 배치) */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-md font-bold text-gray-700">상품 사진 (필수)</label>
            {imageUrls.length > 0 && (
              <button
                type="button"
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
              >
                ✨ AI로 정보 자동채우기
              </button>
            )}
          </div>
          <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />
          {imageUrls.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">사진을 등록하면 AI 분석 기능을 쓸 수 있습니다.</p>
          )}
        </section>

        {/* 2. 기본 정보 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">선택해주세요</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">대여 가격 (1일 기준)</label>
            <input
              type="number"
              placeholder="0원"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">상품명</label>
          <input
            type="text"
            placeholder="예: 캠핑용 릴렉스 체어 2개"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-b-2 border-gray-200 py-2 focus:border-purple-500 focus:outline-none transition-colors text-lg"
          />
        </div>

        {/* 3. 거래 희망 장소 */}
        <section className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
          <label className="text-sm font-bold text-purple-700 block mb-3">어디서 거래할까요?</label>
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="w-full py-4 bg-white border-2 border-purple-200 border-dashed rounded-xl text-purple-600 hover:bg-white hover:border-purple-400 transition-all flex items-center justify-center gap-2 mb-3"
          >
            <span className="text-xl">📍</span>
            <span className="font-semibold">{location ? "거래 장소 변경" : "지도로 장소 선택하기"}</span>
          </button>
          {location && (
            <div className="bg-purple-100/50 px-4 py-2 rounded-lg text-sm text-purple-800 font-medium flex items-center gap-2">
              ✅ {location}
            </div>
          )}
        </section>

        {/* 4. 상세 설명 */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-600">상세 설명</label>
          <textarea
            placeholder="상품에 대한 정보를 자유롭게 적어주세요. AI 기능을 사용하면 상태 정보를 자동으로 포함해 드립니다."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-xl p-4 text-sm border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-purple-600 text-white rounded-xl text-lg font-bold hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all"
        >
          상품 등록하기
        </button>
      </form>

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onConfirm={() => {
          if (location && coords) {
            setShowMapModal(false);
            toast.success("거래 장소가 설정되었습니다.");
          } else {
            toast.error("위치를 선택해주세요.");
          }
        }}
        onLocationSelect={(address, lat, lng) => {
          setLocation(address);
          setCoords({ lat, lng });
        }}
        currentLocation={location}
        initialCenter={coords || undefined}
      />
    </div>
  );
}