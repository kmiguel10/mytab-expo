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

export const getBills = async (userId: string) => {
  try {
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
