export type SellerInfo = {
  id: number;       
  email: string;    
  nickname: string; 
  name?: string;    
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;        
  latitude?: number;       
  longitude?: number;     
  image: string;
  isRented: boolean;
  rating?: number;
  reviews: number;
  seller: SellerInfo;
  likeCount: number;
  category: string;
  isLiked: boolean;
  createdAt: string;
  viewCount: number;
};

export type ProductListItem = {
  id: number;
  title: string;
  price: number;
  isRented: boolean;
  createdAt: string;
  seller: SellerInfo;
  image: string | null;
  rating: number;   
  reviewsCount: number;
};
