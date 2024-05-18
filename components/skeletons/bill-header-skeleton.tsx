import { useWindowDimensions } from "react-native";
import React from "react";
import { Skeleton } from "moti/skeleton";
import { H4, XStack, YStack, View } from "tamagui";

interface Props {
  height: number;
  width: number;
  show: boolean;
  colorMode: "light" | "dark" | undefined;
}

const BillHeaderSkeleton: React.FC<Props> = ({
  height,
  width,
  show,
  colorMode,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  return (
    <YStack justifyContent="space-evenly" gap="$3" padding="$2">
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View gap={"$1"}>
          <Skeleton show={show} colorMode={colorMode} height={18} width={100} />
          <Skeleton
            show={show}
            colorMode={colorMode}
            height={height * 0.25}
            width={windowWidth * 0.35}
          />
        </View>
      </XStack>
      <XStack width={windowWidth * 0.45} gap="$3" paddingHorizontal="$2">
        <View gap={"$1"}>
          <Skeleton show={show} colorMode={colorMode} height={18} width={100} />
          <Skeleton
            show={show}
            colorMode={colorMode}
            height={height * 0.25}
            width={windowWidth * 0.35}
          />
        </View>
        <View gap={"$1"}>
          <Skeleton show={show} colorMode={colorMode} height={18} width={100} />
          <Skeleton
            show={show}
            colorMode={colorMode}
            height={height * 0.25}
            width={windowWidth * 0.35}
          />
        </View>
      </XStack>
    </YStack>
  );
};

export default BillHeaderSkeleton;
