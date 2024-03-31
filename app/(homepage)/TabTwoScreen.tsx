import { Button, useWindowDimensions } from "react-native";
import { Avatar, Fieldset, Form, Input, Text, View, XStack } from "tamagui";
import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { useState } from "react";
import { ProfileInfo } from "@/types/global";
import { signOutUser } from "./profile";

export default function TabTwoScreen() {
  const { id: userId } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();
  return (
    <View>
      <OuterContainer
        padding="$2"
        gap="$2"
        backgroundColor={"whitesmoke"}
        height={height}
      >
        {!displayName ? (
          <BodyContainer
            height={height * 0.86}
            borderBottomRightRadius={"$11"}
            borderBottomLeftRadius={"$11"}
          >
            <Text>{userId}</Text>
            <Text>{JSON.stringify(profileInfo)}</Text>
            <Form onSubmit={onSave} rowGap="$3" borderRadius="$4" padding="$3">
              <View>
                <Avatar
                  size={200}
                  url={avatarUrl}
                  onUpload={(url: string) => {
                    setAvatarUrl(url);
                    updateProfile({ avatar_url: url });
                  }}
                />
                <Text>AvatarUrl: {avatarUrl}</Text>
              </View>

              <XStack>
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    Display name *
                  </Text>
                  <Input
                    id="display-name"
                    placeholder="Display Name"
                    defaultValue=""
                    value={profileInfo?.displayName}
                    onChangeText={handleDisplayNameChange}
                    backgroundColor={"$backgroundTransparent"}
                  />
                </Fieldset>
              </XStack>
              <XStack justifyContent="space-between">
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    First name
                  </Text>
                  <Input
                    id="first-name"
                    placeholder="First Name"
                    defaultValue=""
                    value={profileInfo?.firstName}
                    onChangeText={handleFirstNameChange}
                    backgroundColor={"$backgroundTransparent"}
                  />
                </Fieldset>
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.43}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    Last Name
                  </Text>
                  <Input
                    id="last-name"
                    placeholder="Last Name"
                    defaultValue=""
                    value={profileInfo?.lastName}
                    onChangeText={handleLastNameChange}
                    backgroundColor={"$backgroundTransparent"}
                  />
                </Fieldset>
              </XStack>
              <XStack>
                <Fieldset horizontal={false} gap={"$2"} width={width * 0.9}>
                  <Text paddingLeft="$1.5" fontSize={"$1"}>
                    Email
                  </Text>
                  <Input
                    id="email"
                    placeholder="Email"
                    defaultValue={profileInfo?.email}
                    value={profileInfo?.email}
                    backgroundColor={"$gray"}
                    disabled
                  />
                </Fieldset>
              </XStack>

              <Form.Trigger asChild>
                <Button> Save</Button>
              </Form.Trigger>
              <Button onPress={signOutUser}>Sign out</Button>
            </Form>
            <Text>Tab Two: {id}</Text>
            {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
            <Text>This will show all profile info and log out button</Text>
            <Link href={"/"} replace asChild>
              <Button title="Return to Home / Logout" onPress={signOutUser} />
            </Link>
          </BodyContainer>
        ) : (
          <Redirect
            href={{
              pathname: "/(homepage)/[id]",
              params: { id: userId },
            }}
          />
        )}
      </OuterContainer>
    </View>
  );
}
