import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { productsService } from "@/services/productService";
import { ProductListItem, Product } from "@/types/product";

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async (page = 0, size = 20, position?: any) => {
    setLoading(true);
    try {
      const data = await productsService.getProducts(page, size, position);
      if (data) setItems(data.content);
      return data;
    } catch (err) {
      toast.error("상품 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetail = useCallback(async (postId: number) => {
    setLoading(true);
    try {
      const data = await productsService.getProduct(postId);
      if (data) {
        setProduct(data);
        return true;
      }
      return false;
    } catch (err) {
      toast.error("상품 정보를 불러오는데 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: any) => {
    setLoading(true);
    try {
      const postId = await productsService.createProduct(data);
      toast.success("상품이 등록되었습니다.");
      return postId;
    } catch (err) {
      toast.error("상품 등록에 실패했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (postId: number, data: any) => {
    setLoading(true);
    try {
      await productsService.updateProduct(postId, data);
      toast.success("상품 정보가 수정되었습니다.");
      return true;
    } catch (err) {
      toast.error("수정에 실패했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (postId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return false;
    setLoading(true);
    try {
      await productsService.deleteProduct(postId);
      toast.success("삭제되었습니다.");
      return true;
    } catch (err) {
      toast.error("삭제 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (postId: number) => {
    try {
      const newLikeCount = await productsService.toggleLike(postId);
      toast.success("관심 목록에 반영되었습니다.");
      return newLikeCount;
    } catch (err) {
      toast.error("처리에 실패했습니다.");
      return null;
    }
  };

  const handleToggleBookmark = async (postId: number) => {
    try {
      const result = await productsService.toggleBookmark(postId);
      toast.success("북마크 상태가 변경되었습니다.");
      return result;
    } catch (err) {
      toast.error("북마크 처리에 실패했습니다.");
      return null;
    }
  };

  const handleAnalyzeImage = async (imageUrl: string) => {
    setLoading(true);
    try {
      const result = await productsService.analyzeImage(imageUrl);
      return result;
    } catch (err) {
      toast.error("이미지 분석 중 오류가 발생했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    items, 
    product,
    loading, 
    fetchProducts, 
    fetchProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
    handleToggleLike, 
    handleToggleBookmark,
    handleAnalyzeImage 
  };
};