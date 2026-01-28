import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ordersService } from "@/services/orderService"; 
import { usePayment } from "@/hooks/common/usePayment"; 
import { useProducts } from "@/hooks/domain/useProducts"; // 상품 도메인 훅 임포트
import useUserStore from "@/store/useUserStore";

export const useRent = (id: string | string[]) => {
  const router = useRouter();
  const { user } = useUserStore();
  
  const { fetchProductDetail, product, loading: isProductLoading } = useProducts();
  const { requestPayment, isPaying } = usePayment(); 
  const [isOrderCreating, setIsOrderCreating] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    fetchProductDetail(Number(id)).then((success) => {
      if (!success) {
        router.push(`/products/${id}`);
      }
    });
  }, [id, router, fetchProductDetail]);

  useEffect(() => {
    const merchantId = process.env.NEXT_PUBLIC_PORTONE_MERCHANT_ID;
    if (window.IMP && merchantId) {
      window.IMP.init(merchantId);
    }
  }, []);

  const handleRent = async () => {
    if (!user) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.push(`/login?returnUrl=/rent/${id}`);
      return;
    }
    
    if (!product || isPaying || isOrderCreating || isProductLoading) return;

    setIsOrderCreating(true);

    try {
      const order = await ordersService.createOrder({ 
        postId: product.id, 
        amount: product.price 
      });

      if (!order?.merchantUid) throw new Error("주문 생성 실패");

      await requestPayment(
        {
          pg: "html5_inicis.INIpayTest",
          pay_method: "card",
          merchant_uid: order.merchantUid,
          name: product.title,
          amount: order.amount,
          buyer_email: user.email,
          buyer_name: user.nickname,
          buyer_tel: user.phoneNumber,
        },
        order.orderId,
        () => router.push("/mypage/rentals") 
      );
    } catch (error) {
      toast.error("주문 처리 중 오류가 발생했습니다.");
    } finally {
      setIsOrderCreating(false);
    }
  };

  return { 
    product, 
    isRequesting: isProductLoading || isPaying || isOrderCreating, 
    handleRent 
  };
};