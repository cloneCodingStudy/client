import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { communityService } from "@/services/communityService";
import { CommunityPost, CommunityPostListItem } from "@/types/community";

export const useCommunity = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<CommunityPostListItem[]>([]);
  const [post, setPost] = useState<CommunityPost | null>(null);

  const fetchPosts = useCallback(async (page = 0, size = 20, position?: any, tab?: string) => {
    setLoading(true);
    try {
      const data = await communityService.getPosts(page, size, position, tab);
      if (data) {
        setPosts(data.content);
        return data;
      }
    } catch (err) {
      toast.error("게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const fetchPostDetail = useCallback(async (postId: number) => {
    setLoading(true);
    try {
      const data = await communityService.getPost(postId);
      if (data) {
        setPost(data);
        return data;
      }
    } catch (err) {
      toast.error("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return [];
    try {
      const fileNames = files.map(f => f.name);
      const urls = await communityService.getPresignedUrls(fileNames);
      if (!urls) throw new Error("URL 생성 실패");

      await Promise.all(urls.map((url, i) => communityService.uploadToS3(url, files[i])));
      return urls.map(url => url.split('?')[0]);
    } catch (err) {
      toast.error("이미지 업로드에 실패했습니다.");
      return [];
    }
  };

  const handleCreatePost = async (formData: any, files: File[]) => {
    setLoading(true);
    try {
      const imageUrls = await uploadImages(files);
      const newPost = await communityService.createPost({ ...formData, imageUrls });
      if (newPost) {
        toast.success("게시글이 등록되었습니다.");
        return newPost;
      }
    } catch (err) {
      toast.error("게시글 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postId: number, formData: any, files: File[]) => {
    setLoading(true);
    try {
      const newImageUrls = await uploadImages(files);
      const allImageUrls = [...(formData.imageUrls || []), ...newImageUrls];
      
      const success = await communityService.updatePost(postId, { ...formData, imageUrls: allImageUrls });
      if (success) {
        toast.success("게시글이 수정되었습니다.");
        return true;
      }
    } catch (err) {
      toast.error("수정 실패");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      await communityService.deletePost(postId);
      toast.success("삭제되었습니다.");
      return true;
    } catch (err) {
      toast.error("삭제 실패");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleAddComment = async (postId: number, comment: string) => {
    try {
      await communityService.createComment(postId, comment);
      toast.success("댓글이 등록되었습니다.");
      return true;
    } catch (err) {
      toast.error("댓글 등록 실패");
      return false;
    }
  };

  const handleToggleLike = async (postId: number) => {
    try {
      const newLikeCount = await communityService.toggleLike(postId);
      if (post && post.id === postId) {
        setPost({ ...post, likeCount: newLikeCount, isLiked: !post.isLiked });
      }
      return newLikeCount;
    } catch (err) {
      toast.error("좋아요 처리에 실패했습니다.");
      return null;
    }
  };

  const handleToggleBookmark = async (postId: number) => {
    try {
      await communityService.toggleBookmark(postId);
      if (post && post.id === postId) {
        setPost({ ...post, isBookmarked: !post.isBookmarked });
      }
      toast.success("북마크 상태가 변경되었습니다.");
      return true;
    } catch (err) {
      toast.error("북마크 처리에 실패했습니다.");
      return false;
    }
  };

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const results = await communityService.searchPosts(keyword);
      setPosts(results || []);
    } catch (err) {
      toast.error("검색 결과를 가져오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, posts, post, setPosts,
    fetchPosts, fetchPostDetail, 
    handleCreatePost, handleUpdatePost, handleDeletePost,
    handleAddComment, handleToggleLike, handleToggleBookmark, handleSearch 
  };
};