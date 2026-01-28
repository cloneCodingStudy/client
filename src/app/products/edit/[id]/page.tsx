"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

import { useProducts } from "@/hooks/domain/useProducts";
import ImageUpload from "@/components/common/ImageUpload";
import MapModal from "@/components/common/mapModal";

export default function ProductEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const productId = Number(id);

  const { product, loading, fetchProductDetail, updateProduct } = useProducts();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    description: "",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);

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
    if (productId) {
      fetchProductDetail(productId);
    }
  }, [productId, fetchProductDetail]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        category: product.category,
        price: String(product.price),
        location: product.location,
        description: product.description,
      });
      setImageUrls([product.image]);
      if (product.latitude && product.longitude) {
        setCoords({ lat: product.latitude, lng: product.longitude });
      }
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, location: address }));
    setCoords({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) return toast.error("카테고리를 선택해주세요.");
    if (!formData.title.trim()) return toast.error("상품명을 입력해주세요.");
    if (!formData.price.trim()) return toast.error("가격을 입력해주세요.");
    if (!formData.location.trim()) return toast.error("거래 장소를 설정해주세요.");
    if (!formData.description.trim()) return toast.error("설명을 입력해주세요.");

    const payload = {
      ...formData,
      price: Number(formData.price),
      latitude: coords?.lat,
      longitude: coords?.lng,
      imageUrls,
    };

    const success = await updateProduct(productId, payload);
    if (success) {
      router.push(`/products/${id}`);
    }
  };

  if (loading && !product) return <p className="text-center mt-10">상품 정보를 불러오는 중...</p>;

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-600 p-4 rounded-lg mb-8 bg-gray-50 border border-gray-100">
          ✨ 상품 정보를 수정하세요.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-purple-100 focus:border-primary-purple focus:outline-none transition-all"
          >
            <option value="" disabled hidden>카테고리를 선택해주세요 (필수)</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <div className="border-b border-gray-200 py-3">
            <input
              name="title"
              type="text"
              placeholder="상품명을 입력해주세요."
              value={formData.title}
              onChange={handleInputChange}
              className="w-full text-lg font-bold focus:outline-none bg-transparent placeholder:font-normal"
            />
          </div>

          <div className="border-b border-gray-200 py-3">
            <input
              name="price"
              type="number"
              placeholder="대여 가격 (원)"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full text-lg focus:outline-none bg-transparent"
            />
          </div>

          <div className="space-y-3 py-4">
            <label className="text-sm font-bold text-gray-700">거래 희망 장소 설정</label>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="w-full py-3 px-4 border-2 border-dashed border-purple-200 rounded-xl text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              <span>📍</span>
              <span className="font-medium">{formData.location ? "거래 장소 변경하기" : "지도에서 거래 장소 선택"}</span>
            </button>

            {formData.location && (
              <div className="flex items-center gap-2 border border-purple-100 rounded-xl py-3.5 px-4 bg-purple-50/50">
                <span className="text-purple-500 text-xs">선택된 위치:</span>
                <span className="text-purple-700 font-semibold text-sm">{formData.location}</span>
              </div>
            )}
          </div>

          <textarea
            name="description"
            placeholder="상품 설명을 입력해주세요."
            value={formData.description}
            onChange={handleInputChange}
            rows={10}
            className="w-full resize-none rounded-xl p-5 text-sm border border-gray-200 focus:border-primary-purple focus:ring-4 focus:ring-purple-50 focus:outline-none transition-all"
          />

          <ImageUpload imageUrls={imageUrls} setImageUrls={setImageUrls} />

          <div className="flex justify-end mt-10">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-primary-purple text-white rounded-xl hover:bg-opacity-90 transition-all font-bold shadow-lg shadow-purple-100 active:scale-95 disabled:opacity-50"
            >
              {loading ? "수정 중..." : "상품 수정하기"}
            </button>
          </div>
        </form>
      </div>

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onConfirm={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={formData.location}
        initialCenter={coords || undefined}
      />
    </>
  );
}