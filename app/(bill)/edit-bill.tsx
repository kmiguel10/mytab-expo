import ConfirmDeleteBill from "@/components/bill-settings/confirm-delete-bill";
import ConfirmSaveName from "@/components/bill-settings/confirm-save-name";
import EditMembers from "@/components/bill-settings/edit-members";
import LockSwitch from "@/components/bill-settings/lock-switch";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { StyledInput } from "@/components/input/input";
import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Toast, ToastViewport } from "@tamagui/toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Fieldset, Form, useWindowDimensions, XStack } from "tamagui";

export const EditBill = () => {
  const { width, height } = useWindowDimensions();
  const { id, userId } = useLocalSearchParams();
  const [billInfo, setBillInfo] = useState<BillInfo[]>([]);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const router = useRouter();

  //button handlers
  const onDelete = async () => {
    console.log("delete bill", id);

    const { data, error } = await supabase
      .from("bills")
      .update({ isdeleted: true })
      .eq("billid", id)
      .select();

    if (data) {
      console.log("Deleted bill: ", data);
      router.replace({
        pathname: "/(homepage)/[id]",
        params: { id: userId.toString() },
      });
    } else if (error) {
    }
  };
  const onLock = async () => {
    console.log("lock bill");
    const { data, error } = await supabase
      .from("bills")
      .update({ isLocked: true })
      .eq("billid", id)
      .select();

    if (data) {
      console.log("Locked bill: ", data);
      router.replace({
        pathname: `/(bill)/${id}`,
        params: { userId: userId.toString() },
      });
    } else if (error) {
    }
  };

  //This only changes the name
  const onSubmit = async () => {
    if (billInfo.length > 0) {
      const { data, error } = await supabase
        .from("bills")
        .update({ name: billInfo[0].name })
        .eq("billid", id)
        .select();

      if (data) {
        console.log("submitted bill: ", data);
        // router.replace({
        //   pathname: `/(bill)/mybill/${id}`,
        //   params: { userId: userId.toString() },
        // });
      } else if (error) {
        console.log("ERROR", error);
      }
    }
  };

  const handleBillNameChange = (billName: string) => {
    setBillInfo((prevBillInfo) =>
      prevBillInfo.map((bill) => ({
        ...bill,
        name: billName,
      }))
    );
  };

  const [open, setOpen] = useState(false);
  const [saveNameError, setSaveNameError] = useState(false);
  const timerRef = React.useRef(0);

  /** --- UseEffects --- */
  //Fetch bill info
  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setBillInfo(data);
      }
    }
    fetchBillInfo();
    console.log("userId", userId);
  }, [id, userId]);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      <BodyContainer
        height={height * 0.86}
        borderBottomRightRadius={"$11"}
        borderBottomLeftRadius={"$11"}
      >
        <ToastViewport
          width={"100%"}
          justifyContent="center"
          flexDirection="column-reverse"
          top={0}
          right={0}
        />
        <Form onSubmit={onSubmit} rowGap="$3" borderRadius="$4" padding="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Fieldset horizontal={false} gap={"$2"} width={width * 0.6}>
              <StyledInput
                defaultValue={billInfo[0]?.name}
                onChangeText={handleBillNameChange}
                error={!billInfo[0]?.name}
              ></StyledInput>
            </Fieldset>
            <ConfirmSaveName
              name={billInfo[0]?.name}
              billId={billInfo[0]?.billid}
              userId={userId.toString()}
              setOpen={setOpen}
              setSaveNameError={setSaveNameError}
              disabled={!billInfo[0]?.name}
            />
          </XStack>
        </Form>
        <XStack padding="$3" justifyContent="flex-end">
          <LockSwitch
            size="$2"
            userId={userId.toString()}
            billId={parseInt(id.toString())}
            isLocked={billInfo[0]?.isLocked}
          />
          {/* <Button onPress={onLock}>Lock</Button> */}
        </XStack>
        {/* <Text>{JSON.stringify(billInfo)}</Text> */}
        <EditMembers
          billId={parseInt(id.toString())}
          ownerId={billInfo[0]?.ownerid}
          height={height * 0.5}
        />

        <XStack justifyContent="space-between" padding="$3">
          {/* <Button onPress={onDelete}>Delete</Button> */}
          <ConfirmDeleteBill
            billId={billInfo[0]?.billid}
            userId={userId.toString()}
          />
          {/* <Button
            onPress={() => {
              setOpen(false);
              window.clearTimeout(timerRef.current);
              timerRef.current = window.setTimeout(() => {
                setOpen(true);
              }, 150);
            }}
          >
            Single Toast
          </Button> */}
        </XStack>
        <SaveNameToast
          setOpen={setOpen}
          open={open}
          billName={billInfo[0]?.name}
          saveNameError={saveNameError}
        />
      </BodyContainer>
    </OuterContainer>
  );
};

export default EditBill;

interface SaveNameToastProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  billName: string;
  saveNameError: boolean;
}

const SaveNameToast: React.FC<SaveNameToastProps> = ({
  setOpen,
  open,
  billName,
  saveNameError,
}) => {
  const successMsg = `Bill name changed to ${billName}`;
  const errorMsg = "Error changing bill name";
  return (
    <Toast
      onOpenChange={setOpen}
      open={open}
      animation="100ms"
      enterStyle={{ x: -20, opacity: 0 }}
      exitStyle={{ x: -20, opacity: 0 }}
      opacity={1}
      x={0}
      backgroundColor={saveNameError ? "$red8Light" : "$green8Light"}
      width={"80%"}
      justifyContent="center"
    >
      <Toast.Title textAlign="left">
        {saveNameError ? errorMsg : successMsg}
      </Toast.Title>
    </Toast>
  );
};
