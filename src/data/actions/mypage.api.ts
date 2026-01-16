const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { MyPageSummary} from "@/types/mypage";


export async function getMyPageSummary() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/mypage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("마이페이지 정보를 불러오는데 실패했습니다.");

    return await res.json();
  } catch (err) {
    console.error("[getMyPageSummary]", err);
    return null;
  }
}