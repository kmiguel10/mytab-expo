import {
  Member,
  MyTabInfo,
  SettleCardInfo,
  SummaryInfo,
  Transaction,
} from "@/types/global";

interface getMyTabHeaderAmountsProps {
  myTabInfo: MyTabInfo[];
  userId: string;
}

export const getMyTabHeaderAmounts = ({
  myTabInfo,
  userId,
}: getMyTabHeaderAmountsProps) => {
  let owedAmount = 0;
  let debtAmount = 0;
  let settleMembersInfo: SettleCardInfo[] = [];
  let membersSet = new Set<string>();

  for (const tabInfo of myTabInfo) {
    if (userId === tabInfo.debtor && userId === tabInfo.payer) {
      continue;
    }

    if (userId === tabInfo.debtor) {
      owedAmount += tabInfo.owed_amount;
    } else {
      debtAmount += tabInfo.owed_amount;
    }

    let payer = tabInfo.payer;
    let debtor = tabInfo.debtor;

    // Check if the member exists in settleMembersInfo
    let memberExists = false;
    for (const settleMember of settleMembersInfo) {
      //Check of member is the current payer
      if (settleMember.member === payer || settleMember.member === debtor) {
        memberExists = true;
        if (userId !== payer) {
          // Update owed amount, what payer owed current user
          settleMember.owed += tabInfo.owed_amount;
        } else {
          // Update debt amount
          settleMember.debt += tabInfo.owed_amount;
        }
        // Update settle amount, what the current user owe payer
        settleMember.settleAmount = Math.abs(
          settleMember.debt - settleMember.owed
        );
        break;
      }
    }

    // If the member does not exist, add them to settleMembersInfo
    if (!memberExists) {
      settleMembersInfo.push({
        member: userId !== payer ? payer : debtor,
        owed: userId !== payer ? tabInfo.owed_amount : 0,
        debt: userId === payer ? tabInfo.owed_amount : 0,
        settleAmount: 0,
      });
    }
  }

  console.log(
    "getMyTabHeaderAmounts: owedAmount, debtAmount :",
    owedAmount,
    debtAmount
  );

  return { owedAmount, debtAmount, settleMembersInfo };
};

export const roundToNearestTenth = (num: number) => {
  return Math.round(num * 10) / 10;
};

interface FindUserAvatarProps {
  members: Member[];
  payerId: string;
}

export const findUserAvatar = (payerId: string | null, members: Member[]) => {
  if (!payerId) return "";
  const member = members.find((member) => member.userid === payerId);

  return member ? member.avatar_url : "";
};

interface FindUserDisplayNameProps {
  members: Member[];
  payerId: string;
}

export const findUserDisplayName = (
  payerId: string | null,
  members: Member[]
) => {
  if (!payerId) return "";
  const member = members.find((member) => member.userid === payerId);

  return member ? member.displayName : "";
};

/**
 * This filters the given transaction array to get the current user's transactions
 * @param transactions
 * @param currentUserId
 * @returns Current users transactions
 */
export const filterUserTransactions = (
  transactions: Transaction[],
  member: SummaryInfo
) => {
  return transactions.filter(
    (transaction) => transaction.payerid === member.userid
  );
};

export const truncateToTwoDecimalPlaces = (amount: number): number => {
  return Math.trunc(amount * 100) / 100;
};

export const formatDateToMonthDay = (dateString: Date): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

export const formatDate = (date: Date) => {
  return date?.toLocaleString("en-US", { month: "long", day: "numeric" });
};

export const convertToLocalDate = (dateString: string): Date => {
  const utcDate = new Date(dateString);

  // Get the timezone offset in milliseconds
  const timezoneOffsetInMillis = utcDate.getTimezoneOffset() * 60 * 1000;

  // Convert the UTC date to local time by subtracting the timezone offset
  const localDateMillis = utcDate.getTime() - timezoneOffsetInMillis;

  return new Date(localDateMillis);
};
