import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getMyTabInfo } from "@/lib/api";

interface Props {
  userId: string;
  billId: number;
}

const MyTab: React.FC<Props> = ({ userId, billId }) => {
  const [myTabInfo, setMyTabInfo] = useState<any[] | null>([]);

  useEffect(() => {
    console.log("PARAMS: ", userId, billId);
    async function fetchMyTabInfo() {
      if (userId) {
        const data = await getMyTabInfo(userId, billId);
        console.log("Fetched data: ", data);
        setMyTabInfo(data);
      }
    }
    fetchMyTabInfo();
    console.log("My Tab", myTabInfo);
  }, [userId, billId]);

  return (
    <View>
      <Text>MyTab </Text>
      <Text>{JSON.stringify(myTabInfo)}</Text>
    </View>
  );
};

export default MyTab;
