const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OrderCreateRequest = {
  postId: number;
  amount: number;
};

type OrderCreateResponse = {
  merchantUid: string;
  orderId: number;
  amount: number;
  status: string;
};

export async function createOrder(
  payload: OrderCreateRequest,
): Promise<OrderCreateResponse | null> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("주문서 생성에 실패했습니다.");
    }

    const result = await res.json();
    return result.data ?? result;
  } catch (error) {
    console.error("[createOrder]", error);
    return null;
  }
}