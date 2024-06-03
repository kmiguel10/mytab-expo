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
import { Toast, ToastViewport } from "@tamagui/toast";

interface Props {
  size: SizeTokens;
  defaultChecked?: boolean;
  userId: string;
  billId: number;
  isLocked: boolean;
  disabled: boolean;
}

interface LockTextProps {
  locked: boolean;
}

export const LockSwitch: React.FC<Props> = ({
  size,
  defaultChecked,
  userId,
  billId,
  disabled,
}) => {
  const id = `switch-${size.toString().slice(1)}-${defaultChecked ?? ""}}`;
  const [lock, setlock] = useState(false);
  const [open, setOpen] = useState(false);
  const [toggleError, setToggleError] = useState(false);
  const timerRef = React.useRef(0);

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
  }, [id, userId, lock]);

  return (
    <XStack alignItems="center" gap="$2" justifyContent="space-between">
      {/* <ToastViewport
        width={"100%"}
        justifyContent="center"
        flexDirection="column-reverse"
        top={0}
        right={0}
      /> */}
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
        setOpen={setOpen}
        setToggleError={setToggleError}
        disabled={disabled}
      />
      <LockToast
        setOpen={setOpen}
        open={open}
        locked={lock}
        toggleError={toggleError}
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

interface LockToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  locked: boolean;
  toggleError: boolean;
}

const LockToast: React.FC<LockToastProps> = ({
  setOpen,
  open,
  locked,
  toggleError,
}) => {
  return (
    <Toast
      onOpenChange={setOpen}
      open={open}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={toggleError ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      {toggleError ? (
        <Toast.Title textAlign="left">
          Error {locked ? "locking" : "unlocking"} bill
        </Toast.Title>
      ) : (
        <Toast.Title textAlign="left">
          Bill is {locked ? "locked" : "unlocked"}
        </Toast.Title>
      )}
    </Toast>
  );
};
