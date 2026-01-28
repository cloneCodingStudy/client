"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: number;        
  targetTitle: string;     
  targetType?: "product" | "community" | "user";  // 신고 대상 타입 추가
}

const REPORT_REASONS = [
  "사기/허위 매물",
  "욕설/비방",
  "음란물/선정적 내용",
  "광고/홍보글",
  "개인정보 노출",
  "중복 게시글",
  "기타"
];

export default function ReportModal({ 
  isOpen, 
  onClose, 
  targetId, 
  targetTitle,
  targetType = "product"
}: ReportModalProps) {
  const [reportReason, setReportReason] = useState("");
  const [reportDetail, setReportDetail] = useState("");

  if (!isOpen) return null;

  const handleReport = async () => {
    if (!reportReason) {
      toast.error("신고 사유를 선택해주세요.");
      return;
    }

    try {
      // 실제 신고 API 호출
      // await reportContent({ targetId, targetType, reason: reportReason, detail: reportDetail });
      
      console.log("신고:", { 
        targetId,
        targetType,
        targetTitle,
        reason: reportReason, 
        detail: reportDetail 
      });
      
      toast.success("신고가 접수되었습니다.");
      handleClose();
    } catch (error) {
      toast.error("신고 접수에 실패했습니다.");
    }
  };

  const handleClose = () => {
    setReportReason("");
    setReportDetail("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 - 고정 */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">신고하기</h2>
            <p className="text-xs text-red-500 mt-1 font-medium">허위 신고 시 서비스 이용이 제한될 수 있습니다.</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 - 스크롤 가능 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* 신고 대상 요약 */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">신고 대상 {targetType}</span>
            <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{targetTitle}</p>
          </div>

          {/* 신고 사유 선택 - 카드 형태 */}
          <div className="grid grid-cols-1 gap-2">
            <p className="text-sm font-bold text-gray-700 mb-1">신고 사유를 선택해 주세요</p>
            {REPORT_REASONS.map((reason) => {
              const isSelected = reportReason === reason;
              return (
                <label
                  key={reason}
                  className={`
                    flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-gray-200 bg-white'}
                  `}
                >
                  <span className={`text-sm ${isSelected ? 'font-bold text-red-700' : 'text-gray-600'}`}>
                    {reason}
                  </span>
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={isSelected}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-4 h-4 accent-red-600"
                  />
                </label>
              );
            })}
          </div>

          {/* 상세 내용 입력 */}
          <div 
            className={`
              grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
              ${reportReason ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}
            `}
          >
            <div className="overflow-hidden">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  상세 내용 <span className="text-gray-400 font-normal text-xs">(선택 사항)</span>
                </label>
                <div className="relative">
                  <textarea
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    placeholder="구체적인 위반 사항을 적어주시면 빠른 처리에 도움이 됩니다."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm resize-none transition-all"
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1">
                    <span className={`text-[10px] font-mono ${reportDetail.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                      {reportDetail.length}
                    </span>
                    <span className="text-[10px] text-gray-300">/</span>
                    <span className="text-[10px] text-gray-300 font-mono">500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 - 고정 */}
        <div className="p-6 bg-white border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all"
          >
            취소
          </button>
          <button
            onClick={handleReport}
            disabled={!reportReason}
            className="flex-[2] px-4 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-100 active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            신고 접수하기
          </button>
        </div>
      </div>
    </div>
  );
}