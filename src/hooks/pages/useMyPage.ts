import { useState, useCallback } from "react";
import { mypageService } from "@/services/mypageService";
import { ProductListItem } from "@/types/product";
import { MyPageSummary } from "@/types/mypage";
import toast from "react-hot-toast";
import { ordersService } from "@/services/orderService";

export const useMyPage = () => {
  const [summary, setSummary] = useState<MyPageSummary | null>(null);
  const [list, setList] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mypageService.getMyPageSummary();
      setSummary(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadListData = useCallback(async (
    type: 'products' | 'likes' | 'bookmarks' | 'orders', 
    page = 0
  ) => {
    setLoading(true);
    try {
      let response;
      if (type === 'products') response = await mypageService.getMyProducts(page);
      else if (type === 'orders') response = await mypageService.getMyOrders(page);
      else response = await mypageService.getMyInteractions(type, page);

      if (response) {
        setList(response.content);
        setTotalPages(response.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReturnRental = async (orderId: number) => {
    setLoading(true);
    try {
      const result = await ordersService.returnRental(orderId);
      if (result) {
        toast.success(result.message || "반납 처리가 완료되었습니다.");
        return true;
      }
    } catch (error) {
      toast.error("반납 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
    return false;
  };

  return { 
    summary, 
    list, 
    loading, 
    totalPages, 
    loadSummary, 
    loadListData,
    handleReturnRental
  };
};