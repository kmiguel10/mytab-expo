import { Member } from "@/types/global";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useEffect, useMemo, useState } from "react";
import type { FontSizeTokens, SelectProps } from "tamagui";
import {
  Adapt,
  Label,
  Select,
  Sheet,
  Text,
  XStack,
  YStack,
  getFontSize,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

interface MembersDropdownProps extends SelectProps {
  members: Member[];
  defaultPayer: string;
  onPayerChange: (selectedPayer: string) => void;
}

export default function MembersDropdown({
  members,
  onPayerChange,
  defaultPayer,
  ...props
}: MembersDropdownProps) {
  const [payer, setPayer] = useState("");
  const [defaultPayerId, setDefaultPayerId] = useState("");

  //Handles selection of payer
  //   const handlePayerSelect = (selectedUser: string) => {
  //     setPayer(selectedUser);
  //     onPayerChange(payer);
  //     console.log("Selected User", selectedUser);
  //     console.log("Payer: ", payer);
  //   };
  const handlePayerSelect = (selectedUserId: string) => {
    // Find the member with the selected user id
    const selectedMember = members.find(
      (member) => member.userid === selectedUserId
    );
    if (selectedMember) {
      // Update the payer using the callback function
      setPayer(selectedMember.userid);
      onPayerChange(selectedMember.userid);
    }
    console.log("Payer:", payer);
    console.log("Selectedmember:", selectedMember?.userid);
  };

  const getDefaultId = () => {
    const selectedMember = members.find(
      (member) => member.displayName === defaultPayer
    );

    return selectedMember?.userid ? selectedMember?.userid : null;
  };

  useEffect(() => {
    // setPayer(defaultPayer);
    console.log("DROPDOWN");

    const defaultId = getDefaultId();
    console.log("defaultId", defaultId);
    if (defaultId) {
      setDefaultPayerId(defaultId);
      onPayerChange(defaultId);
    }
  }, [defaultPayer]);

  return (
    <Select
      value={payer}
      onValueChange={handlePayerSelect}
      defaultValue={defaultPayerId}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger>
        <Select.Value placeholder={defaultPayer} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: "spring",
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>Members</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                members.map((item, i) => {
                  return (
                    <Select.Item
                      index={i}
                      key={item.userid}
                      value={item.userid}
                    >
                      <Select.ItemText>{item.displayName}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        {/* <Check size={16} /> */}
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [members]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={"$4"}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? "$true")}
              />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
