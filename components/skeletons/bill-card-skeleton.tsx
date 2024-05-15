import React from "react";
import { Skeleton } from "moti/skeleton";
import { Card, H4, XStack, YStack, View, Text, CardProps } from "tamagui";

interface Props extends CardProps {
  //   width: number;
  //   height: number;
  //   scale: number;
}

const BillCardSkeleton: React.FC<Props> = ({ ...props }) => {
  return (
    <Skeleton.Group show={true}>
      <YStack space="$4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            bordered
            backgroundColor="white"
            borderRadius={"$5"}
            {...props}
            key={index}
            disabled
          >
            <Card.Header>
              <XStack justifyContent="space-between" paddingBottom="$2">
                <Skeleton show={true} width={190} colorMode="light" />
                <Skeleton show={true} width={100} colorMode="light" />
              </XStack>
              <XStack gap="$1">
                <Skeleton
                  show={true}
                  width={60}
                  height={20}
                  colorMode="light"
                />
                <Skeleton
                  show={true}
                  width={60}
                  height={20}
                  colorMode="light"
                />
              </XStack>
            </Card.Header>

            <Card.Footer
              padding="$3"
              justifyContent="space-between"
              alignItems="center"
            >
              <XStack alignContent="center" paddingTop="$5">
                <Skeleton
                  show={true}
                  width={120}
                  height={20}
                  colorMode="light"
                />
              </XStack>

              <XStack alignContent="center">
                <Skeleton
                  height={40}
                  width={40}
                  radius="round"
                  show={true}
                  colorMode="light"
                />
                <Skeleton
                  height={40}
                  width={40}
                  radius="round"
                  show={true}
                  colorMode="light"
                />
                <Skeleton
                  height={40}
                  width={40}
                  radius="round"
                  show={true}
                  colorMode="light"
                />
                <Skeleton
                  height={40}
                  width={40}
                  radius="round"
                  show={true}
                  colorMode="light"
                />
              </XStack>
            </Card.Footer>
          </Card>
        ))}
      </YStack>
    </Skeleton.Group>
  );
};

export default BillCardSkeleton;
