import { View, Text } from "react-native";
import React, { useState } from "react";

import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import type { FontSizeTokens, SelectProps } from "tamagui";
import {
  Adapt,
  Label,
  Select,
  Sheet,
  XStack,
  YStack,
  getFontSize,
} from "tamagui";

import { LinearGradient } from "@tamagui/linear-gradient";

// import { LinearGradient } from "tamagui/linear-gradient";

const PayerDropdown = ({ dropdownValues }: { dropdownValues: any[] }) => {
  const [val, setVal] = useState("owner");
  return (
    <Select defaultValue="test" value={val} onValueChange={setVal}>
      <Select.Trigger>
        <Select.Value placeholder="Something" />
        TEST
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          zIndex={9999}
          native={true}
          modal={true}
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
            animation="100ms"
            enterStyle={{ opacity: 100 }}
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
            <ChevronUp size={2} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>
        <Select.Viewport disableScroll>
          <Select.Group>
            <Select.Label>Members</Select.Label>
            {dropdownValues.map((item, i) => {
              return (
                <Select.Item index={i} key={i} value={item.userid}>
                  <Select.ItemText>{item.userid}</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
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
};

export default PayerDropdown;
