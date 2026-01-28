export type OrderCreateRequest = {
  postId: number;
  amount: number;
};

export type OrderCreateResponse = {
  merchantUid: string;
  orderId: number;
  amount: number;
  status: string;
};