const API_URL = process.env.NEXT_PUBLIC_API_URL;
import {
  SettlementCreateRequest,
  SettlementCreateResponse,
  SettlementItemResponse,
} from "@/types/settlement";

export async function getSettlementItems(ownerId: number) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/settlements/mypage/${ownerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("정산 가능 목록을 불러오는데 실패했습니다.");

    return (await res.json()) as { data: SettlementItemResponse };
  } catch (err) {
    console.error("[getSettlementItems]", err);
    return null;
  }
}

export async function createSettlement(ownerId: number, payload: SettlementCreateRequest) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/settlements/${ownerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("정산 테이블 생성에 실패했습니다.");

    return (await res.json()) as { data: SettlementCreateResponse };
  } catch (err) {
    console.error("[createSettlement]", err);
    return null;
  }
}

export async function completeSettlement(settlementId: number) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/settlements/${settlementId}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("정산 완료 처리에 실패했습니다.");

    return await res.json();
  } catch (err) {
    console.error("[completeSettlement]", err);
    return null;
  }
}
