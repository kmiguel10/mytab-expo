import { supabase } from "./supabase";

export const getMembers = async (billId: number) => {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("userid")
      .eq("billid", billId);
    if (error) {
      throw new Error(error.message);
    }
    console.log("Get members: ", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

/**
 * Gets all of the bills in which the user is a member of
 * @param userId - of the current user
 * @returns bills where user is a member
 */
export const getBillsForUserId = async (userId: string) => {
  try {
    console.log("Getbills userId", userId);
    const { data: billsData, error } = await supabase
      .from("members")
      .select("*")
      .eq("userid", userId);

    if (error) {
      throw new Error(error.message);
    }
    console.log("Get Bills: ", JSON.stringify(billsData));
    return billsData;
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
};

export const getTransactions = async (billId: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("billid", billId);

    if (error) {
      throw new Error(error.message);
    }
    console.log("Transactions: ", JSON.stringify(transactions));
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

// export const getBillSummaryInfo = async (billId: number) => {
//   try {
//     console.log("billId: ", billId);
//     const { data, error } = await supabase
//       .from("members")
//       .select("userid") // Include any other fields you need in the select statement
//       .eq("billid", billId);

//     if (error) {
//       throw new Error(error.message);
//     }

//     console.log("getBillSummaryInfo", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching bill summary info:", error);
//     return [];
//   }
// };

export const getBillSummaryInfo = async (billId: number) => {
  try {
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("userid")
      .eq("billid", billId);

    if (membersError) {
      throw new Error(membersError.message);
    }

    // Iterate through each member and fetch the transactions data
    const summaryInfo = await Promise.all(
      members.map(async (member) => {
        const { data: transactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("amount")
          .eq("billid", billId)
          .eq("payerid", member.userid);

        if (transactionsError) {
          throw new Error(transactionsError.message);
        }

        // Calculate the sum of amounts and count of transactions for the member
        const amountPaid = transactions.reduce(
          (total, txn) => total + txn.amount,
          0
        );
        const txnCount = transactions.length;

        return {
          userid: member.userid,
          amountPaid: amountPaid,
          txnCount: txnCount,
        };
      })
    );

    console.log("getBillSummaryInfo", summaryInfo);
    return summaryInfo;
  } catch (error) {
    console.error("Error fetching bill summary info:", error);
    return [];
  }
};
