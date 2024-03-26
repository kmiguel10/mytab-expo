import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Lock, Unlock } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Label, Separator, SizeTokens, Switch, XStack, Text } from "tamagui";
import ConfirmToggleLock from "./confirm-toggle-lock";

interface Props {
  size: SizeTokens;
  defaultChecked?: boolean;
  userId: string;
  billId: number;
  isLocked: boolean;
}

export const LockSwitch: React.FC<Props> = ({
  size,
  defaultChecked,
  userId,
  billId,
}) => {
  const id = `switch-${size.toString().slice(1)}-${defaultChecked ?? ""}}`;
  const router = useRouter();
  const [lock, setlock] = useState(false);
  //   const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const onToggleLock = async () => {
    const { data, error } = await supabase
      .from("bills")
      .update({ isLocked: !lock })
      .eq("billid", billId)
      .select();

    if (data) {
      setlock(data[0].isLocked);
      //   router.replace({
      //     pathname: `/(bill)/mybill/${billId}`,
      //     params: { userId: userId.toString() },
      //   });
    } else if (error) {
    }
  };

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
    <XStack
      width={200}
      alignItems="center"
      gap="$2"
      justifyContent="space-between"
    >
      <Label
        paddingRight="$0"
        minWidth={90}
        justifyContent="flex-end"
        size={size}
        htmlFor={id}
      >
        Locked {lock.toString()}
      </Label>
      {lock ? <Lock size={"$1"} /> : <Unlock size={"$1"} />}

      <Separator minHeight={20} vertical />
      {/* <Switch id={id} size={size} onCheckedChange={onToggleLock}>
        <Switch.Thumb
          animation={[
            "bouncy",
            {
              transform: {
                overshootClamping: true,
              },
            },
          ]}
        />
      </Switch> */}
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
