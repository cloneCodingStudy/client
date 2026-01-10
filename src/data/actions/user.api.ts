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
 * 내가 등록한 상품 조회 (페이징 적용)
 */
export async function getMyProducts(page: number = 0, size: number = 10) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/user/my-products?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("내 상품을 불러오는데 실패했습니다.");
    
    const data = await res.json();
    
    const mappedContent: ProductListItem[] = data.data.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      isRented: item.status,
      createdAt: item.registerTime, 
      seller: {
        id: 0, 
        nickname: item.nickname, 
        email: ""
      }
    }));

    return { ...data.data, content: mappedContent }; 
  } catch (err) {
    console.error("[getMyProducts]", err);
    return null;
  }
}

/**
 * 내 관심 목록 조회 (type: 'likes' | 'bookmarks')
 */
export async function getMyInteractions(type: 'likes' | 'bookmarks', page: number = 0) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const endpoint = type === 'likes' ? 'my-likes' : 'my-bookmarks';
    
    const res = await fetch(`${API_URL}/user/${endpoint}?page=${page}&size=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("관심 목록을 불러오는데 실패했습니다.");
    
    const data = await res.json();
    
    const mappedContent = data.data.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      isRented: item.status,
      createdAt: item.registerTime,
      seller: { id: 0, nickname: item.nickname }
    }));

    return { ...data.data, content: mappedContent };
  } catch (err) {
    console.error(`[getMyInteractions]`, err);
    return null;
  }
}

/**
 * 회원가입 요청
 */
export async function signupUser(payload: any) {
  const res = await fetch(`${API_URL}/user/sign-up`, {
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
    const res = await fetch(`${API_URL}/user/profile`, {
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
    const res = await fetch(`${API_URL}/user/quit`, {
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