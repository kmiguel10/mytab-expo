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

export type { Member, Bill, User };
