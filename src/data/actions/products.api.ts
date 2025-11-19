import { Product, ProductListItem } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 대여 게시글 목록 조회
 */
export async function getProducts(page: number = 0, size: number = 20) {
  try {
    const res = await fetch(`${API_URL}/products?page=${page}&size=${size}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("상품 목록을 불러오지 못했습니다.");

    const data = await res.json();

    const mapped: ProductListItem[] = data.content.map(
      (item: {
        id: number;
        title: string;
        price: number;
        status: boolean;
        registerTime: string;
        user: {
          id: number;
          nickname?: string;
          email?: string;
        };
      }) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        isRented: item.status,
        createdAt: item.registerTime,
        seller: {
          id: item.user.id,
          nickname: item.user.nickname,
          email: item.user.email,
        },
      })
    );

    return { ...data, content: mapped };
  } catch (err) {
    console.error("[getProducts]", err);
    return null;
  }
}

/**
 * 대여 게시글 상세 조회
 */ export async function getProduct(postId: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${postId}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("상품 상세 조회에 실패했습니다.");

    const data = await res.json();

    const mapped: Product = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      image: data.imageUrl ?? "/images/placeholder.jpg",
      isRented: data.status,
      rating: 0,
      reviews: 0,
      seller: {
        id: 0,
        nickname: data.username,
        email: "",
      },
      category: data.category,
      createdAt: data.createdAt,
    };

    return mapped;
  } catch (err) {
    console.error("[getProduct]", err);
    return null;
  }
}

/**
 * 대여 게시글 생성
 */
export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  imageUrls?: string[];
}): Promise<number | null> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("상품 등록에 실패했습니다.");
    const result = await res.json();
    return result.data;
  } catch (err) {
    console.error("[createProduct]", err);
    return null;
  }
}

/**
 * 대여 게시글 수정
 */
export async function updateProduct(
  postId: number,
  data: {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    category?: string;
    imageUrls?: string[];
  }
): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API_URL}/products/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return res.ok;
  } catch (err) {
    console.error("[updateProduct]", err);
    return false;
  }
}

/**
 * 대여 게시글 삭제
 */
export async function deleteProduct(postId: number): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/products/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.ok;
  } catch (err) {
    console.error("[deleteProduct]", err);
    return false;
  }
}

/**
 * 리뷰 작성
 */
export async function createProductReview(
  postId: number,
  rating: number,
  comment: string
): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/products/review/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    return res.ok;
  } catch (err) {
    console.error("[createProductReview]", err);
    return false;
  }
}
