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

type Transaction = {
  billid: number;
  submittedbyid: string | null;
  payerid: string | null;
  amount: string;
  name: string;
  split: MemberSplitAmount[];
  isdeleted: boolean;
};

export type { Member, Bill, User, Transaction, MemberSplitAmount };
