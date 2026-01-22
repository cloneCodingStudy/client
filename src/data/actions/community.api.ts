import { CommunityPost } from "@/types/community";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 커뮤니티 게시글 목록 조회 (위치 기반 필터링 포함)
 */
export async function getCommunityPosts(
  page: number = 0,
  size: number = 20,
  position?: { lat: number; lng: number; distance: number }
): Promise<{ content: CommunityPost[], totalPages: number, totalElements: number } | null> { 
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (position) {
      params.append("lat", position.lat.toString());
      params.append("lng", position.lng.toString());
      params.append("distance", position.distance.toString());
    }

    const res = await fetch(`${API_URL}/community/posts?${params.toString()}`);
    if (!res.ok) throw new Error("게시글 목록 로드 실패");

    return await res.json(); 
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * 커뮤니티 게시글 상세 조회
 * @param {number} postId - 게시글 ID
 */
export async function getCommunityPost(postId: number): Promise<CommunityPost | null> {
  try {
    const res = await fetch(`${API_URL}/community/${postId}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("게시글 상세 조회에 실패했습니다.");

    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[getCommunityPost]", err);
    return null;
  }
}

/**
 * 커뮤니티 게시글 작성
 */
export async function createCommunityPost(data: {
  title: string;
  content: string;
  category: string;
  location?: string; 
  lat?: number;      
  lng?: number;      
  imageUrls?: string[];
}): Promise<CommunityPost | null> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), 
    });

    if (!res.ok) throw new Error("게시글 작성에 실패했습니다.");

    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[createCommunityPost]", err);
    return null;
  }
}

/**
 * 커뮤니티 게시글 수정
 * @param {number} postId - 게시글 ID
 */
export async function updateCommunityPost(
  postId: number,
  data: {
    title: string;
    content: string;
    category: string;
    imageUrls?: string[];
  }
): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/community/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[updateCommunityPost]", err);
    return false;
  }
}

/**
 * 커뮤니티 게시글 삭제
 * @param {number} postId - 게시글 ID
 */
export async function deleteCommunityPost(postId: number): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/community/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[deleteCommunityPost]", err);
    return false;
  }
}

/**
 * 커뮤니티 게시글 검색
 */
export async function searchCommunityPosts(keyword: string): Promise<CommunityPost[] | null> {
  try {
    const res = await fetch(
      `${API_URL}/community/posts/search?keyword=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) throw new Error("검색에 실패했습니다.");

    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[searchCommunityPosts]", err);
    return null;
  }
}

export async function getPresignedUrls(fileNames: string[]): Promise<string[] | null> {
  try {
    const res = await fetch(`${API_URL}/community/presigned-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileNames }), 
    });

    if (!res.ok) throw new Error("URL 생성 실패");
    const response = await res.json();
    return response.data;
  } catch (err) {
    console.error("[getPresignedUrls]", err);
    return null;
  }
}

export async function uploadFileToS3(presignedUrl: string, file: File) {
  try {
    const res = await fetch(presignedUrl, {
      method: "PUT", 
      body: file,    
      headers: {
        "Content-Type": file.type, 
      },
    });

    if (!res.ok) throw new Error("S3 업로드 실패");
    return true;
  } catch (err) {
    console.error("[uploadFileToS3]", err);
    return false;
  }
}

/**
 * 커뮤니티 댓글 작성
 */
export async function createCommunityComment(postId: number, comment: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/community/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (!res.ok) throw new Error("댓글 작성에 실패했습니다.");
    return true;
  } catch (err) {
    console.error("[createCommunityComment]", err);
    return false;
  }
}
