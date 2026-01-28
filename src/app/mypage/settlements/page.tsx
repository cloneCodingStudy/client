"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

import useUserStore from "@/store/useUserStore";
import { useSettlement } from "@/hooks/pages/useSettlement";
import { SettlementCreateRequest } from "@/types/settlement";

export default function MySettlementsPage() {
  const { user } = useUserStore();
  const ownerId = useMemo(() => user?.id ?? null, [user]);

  const { 
    loading, 
    settlementData, 
    fetchSettlementItems, 
    handleRequestSettlement, 
    handleCompleteSettlement 
  } = useSettlement();

  const [createdSettlementId, setCreatedSettlementId] = useState<number | null>(null);
  const [isSettled, setIsSettled] = useState(false);
  const [formValues, setFormValues] = useState<SettlementCreateRequest>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  useEffect(() => {
    if (ownerId) {
      fetchSettlementItems(ownerId);
    }
  }, [ownerId, fetchSettlementItems]);

  const handleChange = (key: keyof SettlementCreateRequest, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const onCreateSettlement = async () => {
    if (!ownerId) return toast.error("로그인이 필요합니다.");
    if (!formValues.bankName || !formValues.accountNumber || !formValues.accountHolder) {
      return toast.error("정산 계좌 정보를 모두 입력해주세요.");
    }
    if (!settlementData?.items?.length) {
      return toast.error("정산 가능한 항목이 없습니다.");
    }

    const result = await handleRequestSettlement(ownerId, formValues);
    if (result) {
      setCreatedSettlementId(result.settlementId);
      fetchSettlementItems(ownerId);
    }
  };

  const onCompleteSettlement = async () => {
    if (!createdSettlementId) return;
    
    const success = await handleCompleteSettlement(createdSettlementId);
    if (success) {
      setIsSettled(true);
      if (ownerId) fetchSettlementItems(ownerId);
    }
  };

  if (!ownerId) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        로그인 후 정산 정보를 확인할 수 있습니다.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">정산하기</h1>
        <p className="text-sm text-gray-500">
          정산 가능한 항목을 확인하고 계좌 정보를 입력한 뒤 정산을 진행하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* 정산 가능 목록 */}
        <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 bg-gray-50/40">
          <h2 className="font-semibold text-gray-800 mb-4">정산 가능 목록</h2>
          {!settlementData?.items?.length ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              정산 가능한 항목이 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {settlementData.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-white border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {item.productTitle ?? `정산 항목 #${item.id}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      주문번호: {item.orderId ?? "정보 없음"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-purple">
                      {item.amount.toLocaleString()}원
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {item.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 정산 요약 섹션 */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">정산 요약</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>총 정산 금액</span>
            <span className="font-bold text-gray-900 text-lg">
              {(settlementData?.totalAmount ?? 0).toLocaleString()}원
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-6">
            상태: {createdSettlementId ? "정산 요청됨" : "미요청"}
          </div>
          <button
            type="button"
            onClick={onCompleteSettlement}
            disabled={!createdSettlementId || isSettled || loading}
            className={`w-full py-4 text-sm font-bold rounded-xl transition-all shadow-md ${
              createdSettlementId && !isSettled
                ? "bg-primary-purple text-white hover:bg-opacity-90 active:scale-95 shadow-purple-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSettled ? "정산 완료됨" : loading ? "처리 중..." : "정산금 받기"}
          </button>
        </div>
      </div>

      {/* 계좌 정보 입력 섹션 */}
      <div className="border border-gray-100 rounded-2xl p-6 bg-white">
        <h2 className="font-semibold text-gray-800 mb-4">정산 계좌 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "은행명", name: "bankName", placeholder: "예: 국민은행" },
            { label: "계좌번호", name: "accountNumber", placeholder: "예: 110-123-45678" },
            { label: "예금주", name: "accountHolder", placeholder: "예: 홍길동" },
          ].map((field) => (
            <label key={field.name} className="flex flex-col gap-2 text-sm font-medium text-gray-600">
              {field.label}
              <input
                type="text"
                value={(formValues as any)[field.name]}
                onChange={(e) => handleChange(field.name as any, e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-primary-purple outline-none transition-all bg-gray-50/30"
                placeholder={field.placeholder}
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={onCreateSettlement}
            disabled={loading || !settlementData?.items?.length || !!createdSettlementId}
            className={`px-8 py-3.5 text-sm font-bold rounded-xl transition-all ${
              !createdSettlementId && settlementData?.items?.length
                ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {createdSettlementId ? "요청 완료" : loading ? "요청 중..." : "정산 요청하기"}
          </button>
        </div>
      </div>
    </div>
  );
}