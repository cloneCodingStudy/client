"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import useUserStore from "@/store/useUserStore";
import {
  completeSettlement,
  createSettlement,
  getSettlementItems,
} from "@/data/actions/settlements.api";
import {
  SettlementCreateRequest,
  SettlementItem,
} from "@/types/settlement";

export default function MySettlementsPage() {
  const { user } = useUserStore();
  const [items, setItems] = useState<SettlementItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [settlementId, setSettlementId] = useState<number | null>(null);
  const [isSettled, setIsSettled] = useState(false);
  const [formValues, setFormValues] = useState<SettlementCreateRequest>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const ownerId = useMemo(() => user?.id ?? null, [user]);

  useEffect(() => {
    const fetchSettlementItems = async () => {
      if (!ownerId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getSettlementItems(ownerId);
        if (result?.data) {
          setItems(result.data.items ?? []);
          setTotalAmount(result.data.totalAmount ?? 0);
        }
      } catch (error) {
        toast.error("정산 가능 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettlementItems();
  }, [ownerId]);

  const handleChange = (key: keyof SettlementCreateRequest, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateSettlement = async () => {
    if (!ownerId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!formValues.bankName || !formValues.accountNumber || !formValues.accountHolder) {
      toast.error("정산 계좌 정보를 모두 입력해주세요.");
      return;
    }

    if (items.length === 0) {
      toast.error("정산 가능한 항목이 없습니다.");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createSettlement(ownerId, formValues);
      if (!result?.data) {
        toast.error("정산 테이블 생성에 실패했습니다.");
        return;
      }

      setSettlementId(result.data.settlementId);
      setTotalAmount(result.data.totalAmount);
      toast.success("정산이 요청이 완료되었습니다.");
    } catch (error) {
      toast.error("정산 요청 중 오류가 발생했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteSettlement = async () => {
    if (!settlementId) {
      toast.error("정산 테이블이 아직 생성되지 않았습니다.");
      return;
    }

    setIsCompleting(true);
    try {
      const result = await completeSettlement(settlementId);
      if (!result) {
        toast.error("정산 완료 처리에 실패했습니다.");
        return;
      }

      setIsSettled(true);
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          status: "SETTLED",
        }))
      );
      toast.success("정산 완료 처리되었습니다.");
    } catch (error) {
      toast.error("정산 완료 처리 중 오류가 발생했습니다.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400">
        정보를 불러오는 중입니다...
      </div>
    );
  }

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
        <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 bg-gray-50/40">
          <h2 className="font-semibold text-gray-800 mb-4">정산 가능 목록</h2>
          {items.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              정산 가능한 항목이 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
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
                      {item.status ?? "AVAILABLE"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">정산 요약</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>총 정산 금액</span>
            <span className="font-bold text-gray-900">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
          <div className="text-xs text-gray-400 mb-6">
            정산 생성 여부: {settlementId ? `생성됨 (#${settlementId})` : "미생성"}
          </div>
          <button
            type="button"
            onClick={handleCompleteSettlement}
            disabled={!settlementId || isSettled || isCompleting}
            className={`w-full py-3 text-sm font-bold rounded-xl transition-all ${
              settlementId && !isSettled
                ? "bg-primary-purple text-white hover:bg-opacity-90 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSettled ? "정산 완료됨" : isCompleting ? "정산 처리 중..." : "정산 받기"}
          </button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl p-6 bg-white">
        <h2 className="font-semibold text-gray-800 mb-4">정산 계좌 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-2 text-sm text-gray-600">
            은행명
            <input
              type="text"
              value={formValues.bankName}
              onChange={(event) => handleChange("bankName", event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
              placeholder="예: 국민은행"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-gray-600">
            계좌번호
            <input
              type="text"
              value={formValues.accountNumber}
              onChange={(event) => handleChange("accountNumber", event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
              placeholder="예: 110-1234-5678"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-gray-600">
            예금주
            <input
              type="text"
              value={formValues.accountHolder}
              onChange={(event) => handleChange("accountHolder", event.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
              placeholder="예: 홍길동"
            />
          </label>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleCreateSettlement}
            disabled={isCreating || items.length === 0}
            className={`px-6 py-3 text-sm font-bold rounded-xl transition-all ${
              items.length > 0
                ? "bg-primary-purple text-white hover:bg-opacity-90 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isCreating ? "정산 요청 중..." : "정산 요청"}
          </button>
        </div>
      </div>
    </div>
  );
}
