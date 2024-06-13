import { Skeleton } from "moti/skeleton";
import React from "react";
import {
  Card,
  ListItem,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";

interface Props {
  show: boolean;
  colorMode: "light" | "dark" | undefined;
}

const BillSettingsSkeleton: React.FC<Props> = ({
  colorMode = "light",
  show = true,
}) => {
  const { width, height } = useWindowDimensions();
  return (
    <Skeleton.Group show={show}>
      <View rowGap="$3" borderRadius="$4" padding="$3">
        <View margin="$1" gap="$5">
          <Card
            bordered
            backgroundColor="white"
            borderRadius={"$5"}
            height={height * 0.225}
            gap="$7"
            padding="$2.5"
          >
            <YStack paddingLeft="$2">
              <XStack gap="$2" alignItems="center" paddingBottom="$1">
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.02}
                  width={width * 0.25}
                />
              </XStack>
              <XStack
                justifyContent="space-between"
                alignItems="center"
                gap="$2"
              >
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.04}
                  width={width * 0.5}
                />
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.04}
                  width={width * 0.2}
                />
              </XStack>
            </YStack>
            <YStack paddingLeft="$2">
              <XStack gap="$2" alignItems="center" paddingBottom="$1">
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.02}
                  width={width * 0.25}
                />
              </XStack>
              <XStack
                justifyContent="space-between"
                alignItems="center"
                gap="$2"
              >
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.04}
                  width={width * 0.5}
                />
                <Skeleton
                  show={show}
                  colorMode={colorMode}
                  height={height * 0.04}
                  width={width * 0.2}
                />
              </XStack>
            </YStack>
          </Card>
          <XStack justifyContent="space-between">
            <Skeleton
              show={show}
              colorMode={colorMode}
              height={height * 0.04}
              width={width * 0.35}
            />
            <Skeleton
              show={show}
              colorMode={colorMode}
              height={height * 0.04}
              width={width * 0.35}
            />
          </XStack>
          <YStack gap="$2">
            <Skeleton
              show={show}
              colorMode={colorMode}
              height={height * 0.02}
              width={width * 0.5}
            />
            {Array.from({ length: 4 }).map((_, index) => (
              <YGroup
                alignSelf="center"
                bordered
                width={"100%"}
                size="$5"
                padding={"$1"}
              >
                <YGroup.Item>
                  <ListItem
                    key={index}
                    icon={
                      <Skeleton
                        height={40}
                        width={40}
                        radius="round"
                        show={true}
                        colorMode="light"
                      />
                    }
                    title={
                      <YStack gap="$2">
                        <Skeleton
                          show={show}
                          colorMode={colorMode}
                          height={height * 0.02}
                          width={width * 0.18}
                        />
                        <Skeleton
                          show={show}
                          colorMode={colorMode}
                          height={height * 0.02}
                          width={width * 0.18}
                        />
                      </YStack>
                    }
                    iconAfter={
                      <XStack gap="$2">
                        <Skeleton
                          show={show}
                          colorMode={colorMode}
                          height={height * 0.03}
                          width={width * 0.2}
                        />
                        <Skeleton
                          show={show}
                          colorMode={colorMode}
                          height={height * 0.03}
                          width={width * 0.2}
                        />
                      </XStack>
                    }
                  />
                </YGroup.Item>
              </YGroup>
            ))}
          </YStack>
          <XStack paddingTop="$6">
            <Skeleton
              show={show}
              colorMode={colorMode}
              height={height * 0.05}
              width={width * 0.28}
            />
          </XStack>
        </View>
      </View>
    </Skeleton.Group>
  );
};

export default BillSettingsSkeleton;
