import { User } from "@/types/user";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  image: string;
  isRented: boolean;
  rating: number;
  reviews: number;
  seller: User;
  category: string;
  createdAt: string;
};
