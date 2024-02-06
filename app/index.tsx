import { View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { H1, H2, H3, H4, H5, H6, Heading, Paragraph } from "tamagui";
import { Text, XStack, YStack } from "tamagui";
import { Button } from "tamagui";

const Page = () => {
  return (
    <YStack flex={1} borderRadius="$4" padding="$2">
      <H1>LOGIN PAGE</H1>
      <Paragraph size="$2" fontWeight="800">
        This will be the log in page with modal and register Use supabase
        authentication to login with email or iphone or phonenumber
      </Paragraph>
      <Link href={"/(homepage)/home"} replace asChild>
        <Button>LOG IN</Button>
      </Link>
    </YStack>
  );
};

export default Page;
