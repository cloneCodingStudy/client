"use client";

import { useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import { useMyPage } from "@/hooks/pages/useMyPage";

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "₩0";
  return `₩${amount.toLocaleString()}`;
};

export default function MyPage() {
  const { user } = useUserStore();
  
  const { summary, loading, loadSummary } = useMyPage();

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">마이페이지</h2>

      {/* 회원 등급 섹션 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 transition-all hover:shadow-md">
        <h2 className="text-lg font-medium text-gray-600 mb-3">
          현재 <span className="text-gray-900 font-bold">{user?.nickname || user?.username}</span> 회원님의 등급은
        </h2>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black text-primary-purple">
            {loading ? "..." : summary?.grade ?? "브론즈"}
          </span>
          <span className="text-gray-500 mb-1 font-medium">등급입니다.</span>
        </div>
        
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-sm text-purple-700">
            다음 등급까지 <span className="font-bold text-purple-900">
              {loading ? "-" : summary?.nextGradeRemaining ?? 0}건
            </span>의 거래가 더 필요합니다. 조금만 더 힘내세요!
          </p>
        </div>
      </div>

      {/* 대시보드 스탯 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "빌려준 상품", 
            value: `${summary?.lentCount ?? 0}건`, 
            subLabel: "Lent Items" 
          },
          { 
            label: "빌린 상품", 
            value: `${summary?.rentedCount ?? 0}건`, 
            subLabel: "Rented Items" 
          },
          { 
            label: "누적 정산금", 
            value: formatCurrency(summary?.settlementAmount), 
            subLabel: "Total Settlement" 
          },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {stat.subLabel}
            </p>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">{stat.label}</h3>
            <p className="text-2xl font-black text-gray-900">
              {loading ? "..." : stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
