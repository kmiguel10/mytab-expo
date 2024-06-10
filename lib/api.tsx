import { MemberData, ProfileInfo, Transaction } from "@/types/global";
import { supabase } from "./supabase";

export const getMembers = async (billId: number) => {
  try {
    const { data, error } = await supabase
      .from("members")
      .select(
        "memberid, userid, isMemberIncluded, isRequestSent, avatar_url, displayName"
      )
      .eq("isMemberIncluded", true)
      .eq("billid", billId);
    if (error) {
      throw new Error(error.message);
    }
    //console.log(">>> Get members: ", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

export const getMembersWithBillcode = async (billCode: string) => {
  try {
    const { data, error } = await supabase
      .from("members")
      .select(
        "memberid, userid, isMemberIncluded, isRequestSent, avatar_url, displayName"
      )
      .eq("isMemberIncluded", true)
      .eq("billcode", billCode);
    if (error) {
      throw new Error(error.message);
    }
    //console.log(">>> Get members: ", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

export const getMembersAndRequests = async (billId: number) => {
  try {
    const { data, error } = await supabase
      .from("members")
      .select(
        "memberid, userid, isMemberIncluded, isRequestSent,avatar_url, displayName"
      )
      .eq("billid", billId);
    if (error) {
      throw new Error(error.message);
    }
    // console.log(">>> Get members and requests: ", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
};

export const getBillInfo = async (billId: number) => {
  try {
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("billid", billId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching bill: ", error);
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
    //console.log("Getbills userId", userId);
    const { data: billsData, error } = await supabase
      .from("members")
      .select("*")
      .eq("userid", userId)
      .eq("isdeleted", false);

    if (error) {
      throw new Error(error.message);
    }
    console.log("Get Bills by member: ", JSON.stringify(billsData));
    return billsData;
  } catch (error) {
    //console.error("Error fetching bills:", error);
    return [];
  }
};

/**
 * Gets all of the bills in which the user is a member of with an array of members and their URLS
 * @param userId - of the current user
 * @returns bills where user is a member
 */
export const getBillsForUserIdWithUrls = async (
  userId: string
): Promise<MemberData[]> => {
  try {
    const { data: billsData, error } = await supabase
      .from("members")
      .select("*")
      .eq("userid", userId);
    // .eq("isdeleted", false);
    // .eq("isActive", true);

    if (error) {
      throw new Error(error.message);
    }

    if (!billsData || billsData.length === 0) {
      return [];
    }

    const billIds: number[] = billsData.map((bill: MemberData) => bill.billid);

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("avatar_url, userid, billid")
      .in("billid", billIds)
      .eq("isMemberIncluded", true);

    if (memberError) {
      throw new Error(memberError.message);
    }

    const memberUrlsMap: Record<number, string[]> = {};

    if (memberData && memberData.length > 0) {
      memberData.forEach((member: { avatar_url: string; billid: number }) => {
        if (!memberUrlsMap[member.billid]) {
          memberUrlsMap[member.billid] = [];
        }
        memberUrlsMap[member.billid].push(member.avatar_url);
      });
    }

    const billsWithUrls: MemberData[] = billsData.map((bill: MemberData) => ({
      ...bill,
      memberUrls: memberUrlsMap[bill.billid] || [],
    }));

    // console.log("*** Fetch bills with urls by userid: ", billsWithUrls);
    return billsWithUrls;
  } catch (error) {
    console.error("Error fetching bills:", error);
    return [];
  }
};

export const getActiveTransactions = async (billId: string) => {
  try {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("billid", billId)
      .eq("isdeleted", false)
      .order("createdat", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    // console.log("Transactions: ", JSON.stringify(transactions));
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

/**
 * This is used for the summary tab.
 */
export const getBillSummaryInfo = async (billId: number) => {
  try {
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("userid, avatar_url, displayName")
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
          .eq("isdeleted", false)
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
          displayName: member.displayName,
          avatar_url: member.avatar_url,
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

export const getMyTabInfo = async (userId: string, billId: number) => {
  try {
    console.log("userId: ", userId);
    console.log("billId: ", billId);
    let { data: bill_settlements, error } = await supabase
      .from("bill_settlements")
      .select("*")
      .eq("billid", billId)
      .or(`debtor.eq.${userId},payer.eq.${userId}`);

    if (error) {
      throw new Error(error.message);
    }
    console.log("MyTabInfo: ", JSON.stringify(bill_settlements));
    return bill_settlements;
  } catch (error) {
    console.error("There is an error fetching MyTabInfo: ", error);
    return [];
  }
};

/** Edit Transaction */
export const getCurrentTransaction = async (
  transactionId: string
): Promise<Transaction | null> => {
  try {
    console.log("Current Transaction ID: ", transactionId);
    let { data: currentTransaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId);
    if (error) {
      throw new Error(error.message);
    }
    return currentTransaction ? currentTransaction[0] : null;
  } catch (error) {
    console.error(
      "There is an error fetching current transaction: ",
      transactionId
    );
    return null;
  }
};

export const getProfileInfo = async (
  userId: string
): Promise<ProfileInfo | null> => {
  try {
    //console.log("getProfileInfo userId ", userId);
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("displayName,lastName,firstName,avatar_url,email")
      .eq("id", userId);

    //console.log("Profile info data", profile);

    if (error) {
      throw new Error(error.message);
    }

    if (profile && profile.length > 0) {
      // Extract the first item from the profile array
      const profileData = profile[0];
      // Assign the retrieved data to the ProfileInfo type
      const profileInfo: ProfileInfo = {
        displayName: profileData.displayName,
        lastName: profileData.lastName,
        firstName: profileData.firstName,
        avatar_url: profileData.avatar_url,
        email: profileData.email,
      };
      return profileInfo;
    } else {
      // If profile is empty or null, return null
      return null;
    }
  } catch (error) {
    console.error("There is an error fetching profile info: ", userId);
    return null;
  }
};
