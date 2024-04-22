import { Member, MyTabInfo, SettleCardInfo } from "@/types/global";

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

  console.log("owedAmount, debtAmount :", owedAmount, debtAmount);

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
