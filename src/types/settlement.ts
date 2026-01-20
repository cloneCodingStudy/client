export type SettlementItem = {
  id: number;
  amount: number;
  productTitle?: string;
  orderId?: number;
  status?: string;
};

export type SettlementItemResponse = {
  items: SettlementItem[];
  totalAmount: number;
};

export type SettlementCreateRequest = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
};

export type SettlementCreateResponse = {
  settlementId: number;
  totalAmount: number;
};
