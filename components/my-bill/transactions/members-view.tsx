import React, { useEffect } from "react";
import { Avatar, ScrollView, XStack } from "tamagui";

interface Props {
  members: any[];
  height: number;
}

const MembersView: React.FC<Props> = ({ members, height }) => {
  useEffect(() => {
    console.log("Header member", members);
  }, [members]);

  return (
    <XStack gap={1} height={height * 0.25}>
      <ScrollView horizontal={true}>
        {members.map((member, index) => (
          <XStack key={index}>
            <Avatar circular size="$2" key={index}>
              <Avatar.Image
                accessibilityLabel="Nate Wienert"
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
              />
              <Avatar.Fallback delayMs={600} backgroundColor="$blue10" />
            </Avatar>
          </XStack>
        ))}
      </ScrollView>
    </XStack>
  );
};

export default MembersView;
