typescript;

type Member = {
  memberid: string;
  userid: string;
  isMemberIncluded: boolean;
  isRequestSent: boolean;
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

type MemberData = {
  memberid?: string; // UUID
  userid?: string | null; // UUID or NULL
  billid: number; // BigSerial
  billcode?: string | null; // Character Varying(6) or NULL
  ownerid?: string | null; // UUID or NULL
  name?: string | null; // Text or NULL
  amount?: number | null; // Numeric or NULL
  isBillActive?: boolean; // Boolean or NULL
  isMemberIncluded: boolean; // Boolean or NULL
  isLocked: boolean; // Boolean (Not nullable)
  isdeleted: boolean; // Boolean (Not nullable)
  isRequestSent: boolean; // Boolean or NULL
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
  isActive: boolean;
  isLocked: boolean;
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

type ProfileInfo = {
  displayName: string;
  lastName: string;
  firstName: string;
  avatar_url: string;
  email: string;
};

export type {
  Member,
  Bill,
  User,
  Transaction,
  MemberSplitAmount,
  SelectedMemberSplitAmount,
  MemberData,
  BillData,
  BillInfo,
  SummaryInfo,
  MyTabInfo,
  SettleCardInfo,
  ProfileInfo,
};
