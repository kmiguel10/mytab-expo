typescript;

type Member = {
  memberId: number;
  memberName: string;
};

type Bill = {
  billId: number;
  members: Member[];
};

type User = {
  userId: number;
  name: string;
  bills: Bill[];
};

type MemberSplitAmount = {
  memberId: string; // UUID of the member
  amount: number; // Amount corresponding to the member
};

type SelectedMemberSplitAmount = {
  isIncluded: boolean;
  memberId: string; // UUID of the member
  amount: number; // Amount corresponding to the member
};

// type Transaction = {
//   billid: number;
//   submittedbyid: string | null;
//   payerid: string | null;
//   amount: string;
//   name: string;
//   split: Split[];
//   isdeleted: boolean;
// };

type BillData = {
  memberid: string;
  userid: string;
  billid: number;
  billcode: string;
  ownerid: string;
  name: string;
  createdAt: Date;
  isDeleted: boolean;
  isSettled: boolean;
  amount: number;
};

type Member = {
  amount: number;
  memberId: string;
};

type Split = {
  amount: number;
  memberId: string;
  isIncluded?: boolean;
};

type Transaction = {
  id?: number | null;
  billid: number;
  submittedbyid: string;
  payerid: string | null;
  createdate?: string;
  amount: number;
  name: string;
  notes: string | null;
  split: Split[];
  isdeleted: boolean;
};

type BillInfo = {
  billid: number;
  ownerid: string;
  name: string;
  billcode: string;
  isdeleted: boolean;
  createdat: string;
  issettled: boolean;
  amount: number;
};

type SummaryInfo = {
  amountPaid: number;
  txnCount: number;
  userid: string;
};

type MyTabInfo = {
  billid: number;
  debtor: string;
  id: number;
  issettled: boolean;
  owed_amount: number;
  payer: string;
};

type SettleCardInfo = {
  member: string;
  owed: number;
  debt: number;
  settleAmount: number;
};

export type {
  Member,
  Bill,
  User,
  Transaction,
  MemberSplitAmount,
  SelectedMemberSplitAmount,
  BillData,
  BillInfo,
  SummaryInfo,
  MyTabInfo,
  SettleCardInfo,
};
