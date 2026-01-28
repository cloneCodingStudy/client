export type CommunityCategory = "ALL" | "HOT" | "INFO" | "TIP" | "PET" | "BBANG" | "LOST";

export interface CommunityPostListItem {
  id: number;
  title: string;
  content: string; 
  category: CommunityCategory;
  location: string;
  thumbnailUrl?: string;
  username: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
}

export interface CommunityPost extends CommunityPostListItem {
  imageUrls: string[];
  comments: CommunityComment[];
  latitude?: number;
  longitude?: number;
  isLiked?: boolean;     
  isBookmarked?: boolean; 
}

export interface CommunityComment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommunityUser {
  id: number;
  username: string;
  nickName: string;
  email: string;
}