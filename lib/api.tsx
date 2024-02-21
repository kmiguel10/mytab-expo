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
