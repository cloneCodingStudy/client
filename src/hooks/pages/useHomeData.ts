import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/domain/useProducts";
import { useCommunity } from "@/hooks/domain/useCommunity";
import { ProductListItem } from "@/types/product";
import { CommunityPost } from "@/types/community";

export const useHomeData = () => {
  const { fetchProducts, loading: isProductLoading } = useProducts();
  const { fetchPosts, loading: isCommunityLoading } = useCommunity();

  const [productList, setProductList] = useState<ProductListItem[]>([]);
  const [communityPostList, setCommunityPostList] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const fetchMainData = async () => {
      // 2. 병렬 호출로 최적화 (자바의 CompletableFuture.allOf 느낌)
      try {
        const [productsData, communityData] = await Promise.all([
          fetchProducts(0, 4),
          fetchPosts(0, 4)     
        ]);

        if (productsData) setProductList(productsData.content);
        if (communityData) setCommunityPostList(communityData.content);
      } catch (error) {
        console.error("홈 데이터 로드 중 오류 발생:", error);
      }
    };

    fetchMainData();
  }, [fetchProducts, fetchPosts]);

  return {
    productList,
    communityPostList,
    isLoading: isProductLoading || isCommunityLoading
  };
};