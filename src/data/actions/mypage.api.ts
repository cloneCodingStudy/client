const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { MyPageSummary} from "@/types/mypage";
import { ProductListItem } from "@/types/product";


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

/**
 * 내가 등록한 상품 조회 (페이징 적용)
 */
export async function getMyProducts(page: number = 0, size: number = 10) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/mypage/my-products?page=${page}&size=${size}`, {
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
      imageUrl: item.imageUrl,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      
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
    
    const res = await fetch(`${API_URL}/mypage/${endpoint}?page=${page}&size=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("관심 목록을 불러오는데 실패했습니다.");
    
    const data = await res.json();
    
   const mappedContent: ProductListItem[] = data.data.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      isRented: item.status,
      createdAt: item.registerTime, 
      imageUrl: item.imageUrl,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      
      seller: {
        id: 0, 
        nickname: item.nickname, 
        email: ""
      }
    }));

    return { ...data.data, content: mappedContent };
  } catch (err) {
    console.error(`[getMyInteractions]`, err);
    return null;
  }
}

/**
 * 내가 주문한 상품 조회 (페이징 적용)
 */
export async function getMyOrders(page: number = 0, size: number = 10) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const res = await fetch(`${API_URL}/mypage/my-orders?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("내 주문을 불러오는데 실패했습니다.");
    
    const data = await res.json();
    
    const mappedContent: ProductListItem[] = data.data.content.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      isRented: item.status,
      createdAt: item.registerTime, 
      imageUrl: item.imageUrl,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      
      seller: {
        id: 0, 
        nickname: item.nickname, 
        email: ""
      }
    }));

    return { ...data.data, content: mappedContent }; 
  } catch (err) {
    console.error("[getMyOrders]", err);
    return null;
  }
}

