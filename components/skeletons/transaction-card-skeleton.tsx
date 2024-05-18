import { useWindowDimensions } from "react-native";
import React from "react";
import { Skeleton } from "moti/skeleton";
import { ListItem, XStack, YGroup, View, Text, H1 } from "tamagui";
import Avatar from "../login/avatar";

interface Props {
  show: boolean;
  colorMode: "light" | "dark" | undefined;
}

const TransactionCardSkeleton: React.FC<Props> = ({ show, colorMode }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  return (
    <Skeleton.Group show={true}>
      <XStack
        flex={1}
        flexWrap="wrap"
        gap="$1"
        backgroundColor={"transparent"}
        justifyContent="center"
        paddingBottom="$2"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <XStack
            padding="$1"
            backgroundColor={"transparent"}
            justifyContent="center"
            key={index}
          >
            <YGroup
              alignSelf="center"
              bordered
              width={windowWidth * 0.9}
              size="$4"
            >
              <YGroup.Item>
                <ListItem
                  hoverTheme
                  icon={
                    <XStack gap="$2" alignItems="center">
                      <Skeleton height={20} width={40} colorMode={colorMode} />
                      <Skeleton
                        height={45}
                        width={45}
                        radius="round"
                        show={true}
                        colorMode={colorMode}
                      />
                    </XStack>
                  }
                  title={
                    <XStack alignContent="center" paddingTop="$3">
                      <Skeleton height={20} width={80} colorMode={colorMode} />
                    </XStack>
                  }
                  subTitle={
                    <XStack alignContent="center" paddingBottom="$1">
                      <Skeleton height={13} width={80} colorMode={colorMode} />
                    </XStack>
                  }
                  iconAfter={
                    <Skeleton height={25} width={60} colorMode={colorMode} />
                  }
                />
              </YGroup.Item>
            </YGroup>
          </XStack>
        ))}
      </XStack>
    </Skeleton.Group>
  );
};

export default TransactionCardSkeleton;
