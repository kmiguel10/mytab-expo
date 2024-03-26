import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Lock, Unlock } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Label,
  Separator,
  SizeTokens,
  Switch,
  XStack,
  Text,
  View,
} from "tamagui";
import ConfirmToggleLock from "./confirm-toggle-lock";

interface Props {
  size: SizeTokens;
  defaultChecked?: boolean;
  userId: string;
  billId: number;
  isLocked: boolean;
}

interface LockTextProps {
  locked: boolean;
}

export const LockSwitch: React.FC<Props> = ({
  size,
  defaultChecked,
  userId,
  billId,
}) => {
  const id = `switch-${size.toString().slice(1)}-${defaultChecked ?? ""}}`;
  const [lock, setlock] = useState(false);

  //Fetch bill info
  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(billId));
        // setBillInfo(data);
        setlock(data[0].isLocked);
      }
    }
    fetchBillInfo();
    console.log("LOCK", lock);
  }, [id, userId, lock]);

  return (
    <XStack alignItems="center" gap="$2" justifyContent="space-between">
      <LockText locked={lock} />
      <Label minWidth={200} justifyContent="flex-end" size={size} htmlFor={id}>
        {/* <LockText locked={lock} /> */}
      </Label>
      {lock ? <Lock size={"$1"} /> : <Unlock size={"$1"} />}

      <Separator minHeight={20} vertical />
      <ConfirmToggleLock
        billId={billId}
        userId={userId}
        lock={lock}
        setLock={setlock}
        size={size.toString()}
      />
    </XStack>
  );
};

export default LockSwitch;

const LockText: React.FC<LockTextProps> = ({ locked }) => {
  return (
    <View
      backgroundColor={locked ? "$red4Light" : "$green4Light"}
      paddingHorizontal={"$2"}
      paddingVertical={"$1"}
      alignItems="center"
      borderRadius={"$12"}
    >
      <Text fontSize={"$1"}>{locked ? "Locked" : "Unlocked"}</Text>
    </View>
  );
};
