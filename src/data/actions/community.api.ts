import { CommunityPost } from "@/types/community";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 커뮤니티 게시글 목록 조회
 */
export async function getCommunityPosts(): Promise<CommunityPost[] | null> {
  try {
    const res = await fetch(`${API_URL}/community/posts`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("게시글 목록을 불러오지 못했습니다.");

    const data = await res.json();
    return data.content;
  } catch (err) {
    console.error("[getCommunityPosts]", err);
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

    return await res.json();
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
  imageUrls?: string[];
}): Promise<CommunityPost | null> {
  try {
    const res = await fetch(`${API_URL}/community`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("게시글 작성에 실패했습니다.");

    return await res.json();
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
    const res = await fetch(`${API_URL}/community/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.ok;
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
    const res = await fetch(`${API_URL}/community/${postId}`, {
      method: "DELETE",
    });

    return res.ok;
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

    return await res.json();
  } catch (err) {
    console.error("[searchCommunityPosts]", err);
    return null;
  }
}

/**
 * presigned URL 요청
 */

export async function getPresignedUrls(fileNames: string[]) {
  try {
    const res = await fetch(`${API_URL}/community/presigned-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileNames }),
    });

    if (!res.ok) throw new Error("실패");
    return await res.json();
  } catch (err) {
    console.error("[getPresignedUrls]", err);
    return null;
  }
}

/**
 * 커뮤니티 댓글 작성
 */
export async function createCommunityComment(postId: number, comment: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/community/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
