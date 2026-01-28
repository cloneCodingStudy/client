export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];         
  totalPages: number;   
  totalElements: number; 
  size: number;          
  number: number;       
  last: boolean;        
  first: boolean;       
  empty: boolean;       
}