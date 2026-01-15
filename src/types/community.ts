//커뮤니티 게시글
export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  location: string;        
  latitude?: number;       
  longitude?: number; 
  category: CommunityCategory;
  username: string;
  imageUrls?: CommunityImage[];
  comments?: CommunityComment[];
}

//커뮤니티 카테고리
export type CommunityCategory = "ALL" | "HOT" | "INFO" | "TIP" | "PET" | "BBANG" | "LOST";

//커뮤니티 유저
export interface CommunityUser {
  id: number;
  username: string;
  nickName: string;
  email: string;
}

//커뮤니티 첨부 이미지
export interface CommunityImage {
  id: number;
  imageUrl: string;
}

//커뮤니티 댓글
export interface CommunityComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}
