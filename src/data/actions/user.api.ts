const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { ProductListItem } from "@/types/product";
/**
 * JWT 토큰 페이로드 디코딩 (공통 유틸)
 */
export const decodePayload = (token: string) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("JWT Decoding Error:", err);
    return null;
  }
};

/**
 * 로그인 요청
 */
export async function loginUser(credentials: { userId: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!res.ok) return { ok: false, status: res.status };

  const data = await res.json();
  const accessToken = res.headers.get("access");
  
  return { ok: true, data, accessToken };
}



/**
 * 회원가입 요청
 */
export async function signupUser(payload: any) {
  const res = await fetch(`${API_URL}/users/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  return { ok: res.ok, result };
}

/**
 * 회원정보 수정
 */
export async function updateUser(data: {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  birthDate?: string;
  address?: string;
}) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("회원정보 수정에 실패했습니다.");
    return await res.json();
  } catch (err) {
    console.error("[updateUser]", err);
    return null;
  }
}

/**
 * 회원 탈퇴
 */
export async function deleteUser() {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/users/quit`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (err) {
    console.error("[deleteUser]", err);
    return false;
  }
}