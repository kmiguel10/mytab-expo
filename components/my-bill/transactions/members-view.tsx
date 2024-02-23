import { View, Text } from "react-native";
import React from "react";
import { Avatar, XStack, YStack } from "tamagui";

interface Props {
  members: any[];
}

const MembersView: React.FC<Props> = ({ members }) => {
  return (
    <XStack gap={1}>
      {members.map((member, index) => (
        <YStack key={index}>
          <Avatar circular size="$2" key={index}>
            <Avatar.Image
              accessibilityLabel="Nate Wienert"
              src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
            />
            <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
          </Avatar>
        </YStack>
      ))}
    </XStack>
  );
};

export default MembersView;
