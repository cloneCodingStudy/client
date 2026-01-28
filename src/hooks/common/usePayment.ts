import { useState } from "react";
import toast from "react-hot-toast";
import { paymentService } from "@/services/paymentService";

export const usePayment = () => {
  const [isPaying, setIsPaying] = useState(false);

  const requestPayment = async (
    paymentConfig: any, 
    orderId: number, 
    onSuccess: () => void
  ) => {
    const { IMP } = window as any;
    if (!IMP) {
      toast.error("결제 모듈을 불러오지 못했습니다.");
      return;
    }

    setIsPaying(true);

    IMP.request_pay(paymentConfig, async (response: any) => {
      if (response.success) {
        try {
          await paymentService.completePayment({
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
            amount: response.paid_amount,
            orderId: orderId,
          });
          
          toast.success("결제가 완료되었습니다.");
          onSuccess(); 
        } catch (err) {
          console.error(err);
          toast.error("결제 확인 중 문제가 발생했습니다.");
        }
      } else {
        toast.error(response.error_msg || "결제에 실패했습니다.");
      }
      setIsPaying(false);
    });
  };

  return { requestPayment, isPaying };
};