"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Product } from "@/types/product";
import { getProduct } from "@/data/actions/products.api";
import { createOrder } from "@/data/actions/orders.api";
import useUserStore from "@/store/useUserStore";

export default function RentPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;

      const data = await getProduct(Number(id));

      if (!data) {
        toast.error("상품 정보를 불러오지 못했습니다.");
        router.push(`/products/${id}`);
        return;
      }

      setProduct(data);
    }

    fetchData();
  }, [id, router]);

  useEffect(() => {
    const merchantId = process.env.NEXT_PUBLIC_PORTONE_MERCHANT_ID;
    if (!merchantId) return;

    const timer = setInterval(() => {
      if (window.IMP) {
        window.IMP.init(merchantId);
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);



  const handleRent = () => {

    if (!user) {
      toast.error("로그인이 필요한 서비스입니다.");
      router.push("/login?returnUrl=/rent/[id]");
      return;
    }

    if (!product) return;

    if (!window.IMP) {
      toast.error("결제 스크립트를 불러오지 못했습니다.");
      return;
    }

    const merchantId = process.env.NEXT_PUBLIC_PORTONE_MERCHANT_ID;
    if (!merchantId) {
      toast.error("결제 설정이 누락되었습니다.");
      return;
    }

    if (isRequesting) return;
    setIsRequesting(true);

    (async () => {
      try {
        const order = await createOrder({
          postId: product.id,
          amount: product.price,
        });

        if (!order?.merchantUid) {
          throw new Error("주문서 생성에 실패했습니다.");
        }

         window.IMP.request_pay(
          {
            pg: "html5_inicis.INIpayTest",
            pay_method: "card",
            merchant_uid: order.merchantUid,
            name: product.title,
            amount: order.amount,
            buyer_email: user?.email,
            buyer_name: user?.name,
            buyer_tel: user?.phoneNumber,
            buyer_addr: product.location,
            buyer_postcode: "000-000",
          },
          async (response) => {
            if (response.success && response.imp_uid && response.merchant_uid) {
              try {
                const result = await fetch("/api/payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    imp_uid: response.imp_uid,
                    merchant_uid: response.merchant_uid,
                    amount: order.amount,
                    order_id: order.orderId,
                  }),
                });

                if (!result.ok) {
                  throw new Error("결제 검증 요청에 실패했습니다.");
                }

                toast.success("결제가 완료되었습니다.");
              } catch (error) {
                console.error(error);
                toast.error("결제 확인 중 문제가 발생했습니다.");
              } finally {
                setIsRequesting(false);
              }

              return;
            }

            toast.error(response.error_msg ?? "결제에 실패했습니다.");
                        setIsRequesting(false);
          },
        );
      } catch (error) {
        console.error(error);
        toast.error("주문서 생성 중 문제가 발생했습니다.");
        setIsRequesting(false);
      }
    })();
  };

  if (!product) return <p className="text-center mt-20">불러오는 중...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">대여 주문서</h1>

      {/* 상품 정보 */}
      <div className="border rounded-xl p-6 flex items-start gap-6 shadow-sm mb-8 bg-white">
        <div className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden" />
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">{product.title}</span>
          <span className="text-gray-500 text-sm">{product.location}</span>
          <span className="text-3xl font-bold text-[var(--color-primary)] mt-2">
            {product.price.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handleRent}
        className="w-full py-4 rounded-xl bg-primary-purple text-white font-semibold hover:bg-primary-purple-alt transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={isRequesting}
        >
        {isRequesting ? "결제 처리 중..." : "결제하고 빌려요"}
      </button>
    </div>
  );
}
