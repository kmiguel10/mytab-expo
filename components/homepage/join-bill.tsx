import { getMembersWithBillcode } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AlertDialog, Input, Spinner, XStack, YStack } from "tamagui";
import { StyledButton } from "../button/button";

interface Props {
  avatarUrl: string | null;
  displayName: string;
  buttonWidth: number;
  buttonSize: string;
}

const freePlanMembersLimit = 2;
const paidPlanMembersLimit = 12;

const JoinBill: React.FC<Props> = ({
  avatarUrl,
  buttonWidth,
  buttonSize,
  displayName,
}) => {
  const { id } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinAsMember = async () => {
    setIsLoading(true);
    if (!code) {
      console.error("Error: Billcode cannot be null");
      setIsLoading(false);
      return;
    }

    try {
      const membersData = await getMembersWithBillcode(code);
      if (membersData) {
        if (!checkMembersLimit(membersData, router, id)) {
          return;
        }
      }
      await joinOrUpdateMember(
        id.toString(),
        code,
        avatarUrl,
        displayName,
        router
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error joining bill:", error);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { errorMessage: "Error joining bill" },
      });
    }
  };

  const handleCancel = () => {
    setCode("");
  };

  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <StyledButton active={true} size={buttonSize} width={buttonWidth}>
          Join
        </StyledButton>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.9}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: { overshootClamping: true },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={-100}
          width={"90%"}
        >
          <YStack space>
            <AlertDialog.Title>Join Bill</AlertDialog.Title>
            <AlertDialog.Description size={"$5"}>
              Enter Bill code:
            </AlertDialog.Description>
            <Input
              placeholder="Example: 12GH89"
              value={code}
              onChangeText={setCode}
            />

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <StyledButton
                  width={buttonWidth}
                  size={buttonSize}
                  onPress={handleCancel}
                >
                  Cancel
                </StyledButton>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <StyledButton
                  width={buttonWidth}
                  size={buttonSize}
                  active={!!code}
                  disabled={!code}
                  onPress={handleJoinAsMember}
                >
                  Join
                </StyledButton>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

const checkMembersLimit = (
  membersData: any[],
  router: any,
  id: any
): boolean => {
  const isFreePlan = membersData[0]?.isFree;
  const membersLimit = isFreePlan ? freePlanMembersLimit : paidPlanMembersLimit;

  if (membersData.length >= membersLimit) {
    router.replace({
      pathname: `/(homepage)/${id}`,
      params: {
        errorMessage: `The max amount of ${membersLimit} members has been reached.`,
      },
    });
    return false;
  }
  return true;
};

const joinOrUpdateMember = async (
  id: string,
  code: string,
  avatarUrl: string | null,
  displayName: string,
  router: any
) => {
  const { data, error } = await supabase
    .from("members")
    .insert([
      { userid: id, billcode: code, avatar_url: avatarUrl, displayName },
    ])
    .eq("billcode", code)
    .select();

  if (data && data.length > 0) {
    const joinedBillData = data[0] as BillData;
    router.replace({
      pathname: `/(homepage)/${id}`,
      params: { joinedBillCode: joinedBillData?.billid ?? null },
    });
  } else {
    await handleMemberUpdate(id, code, router);
  }
};

const handleMemberUpdate = async (id: string, code: string, router: any) => {
  const { data, error } = await supabase
    .from("members")
    .update({ isMemberIncluded: false, isRequestSent: true })
    .eq("userid", id)
    .eq("billcode", code)
    .select();

  if (data && data.length > 0) {
    const joinedBillData = data[0] as BillData;
    router.replace({
      pathname: `/(homepage)/${id}`,
      params: { joinedBillCode: joinedBillData?.billid ?? null },
    });
  } else {
    console.error("Error updating member:", error);
    router.replace({
      pathname: `/(homepage)/${id}`,
      params: { errorMessage: "Error joining bill" },
    });
  }
};

export default JoinBill;
