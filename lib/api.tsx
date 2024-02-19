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
