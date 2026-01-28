import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { settlementService } from "@/services/settlementService";
import { SettlementItemResponse, SettlementCreateRequest } from "@/types/settlement";

export const useSettlement = () => {
  const [loading, setLoading] = useState(false);
  const [settlementData, setSettlementData] = useState<SettlementItemResponse | null>(null);

  const fetchSettlementItems = useCallback(async (ownerId: number) => {
    setLoading(true);
    try {
      const data = await settlementService.getItems(ownerId);
      setSettlementData(data);
    } catch (err) {
      toast.error("정산 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRequestSettlement = async (ownerId: number, payload: SettlementCreateRequest) => {
    setLoading(true);
    try {
      const result = await settlementService.createSettlement(ownerId, payload);
      if (result) {
        toast.success("정산 요청이 생성되었습니다.");
        return result;
      }
    } catch (err) {
      toast.error("정산 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
    return null;
  };

  const handleCompleteSettlement = async (settlementId: number) => {
    setLoading(true);
    try {
      await settlementService.completeSettlement(settlementId);
      toast.success("정산이 완료되었습니다.");
      return true;
    } catch (err) {
      toast.error("정산 완료 처리 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    settlementData,
    fetchSettlementItems,
    handleRequestSettlement,
    handleCompleteSettlement
  };
};