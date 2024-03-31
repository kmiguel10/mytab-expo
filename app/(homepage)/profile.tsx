import { StyleSheet, useWindowDimensions } from "react-native";

import {
  Fieldset,
  Form,
  Input,
  Text,
  View,
  XStack,
  Button,
  Avatar as AvatarTamagui,
  YStack,
} from "tamagui";

import { supabase } from "@/lib/supabase";

import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { BodyContainer } from "@/components/containers/body-container";
import { OuterContainer } from "@/components/containers/outer-container";
import { useEffect, useState } from "react";
import { ProfileInfo } from "@/types/global";
import Avatar from "@/components/login/avatar";
import { getProfileInfo } from "@/lib/api";
import { FooterContainer } from "@/components/containers/footer-container";

export default function TabTwoScreen() {
  const { id: userId } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  /** Functions */
  const signOutUser = async () => {
    await supabase.auth.signOut();
    console.log("USER SIGNED OUT");
  };
  const onSave = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          displayName: profileInfo?.displayName,
          firstName: profileInfo?.firstName,
          lastName: profileInfo?.lastName,
        })
        .eq("id", userId)
        .select();

      if (data) {
        console.log("*** User updated: ", data);
        router.replace({
          pathname: "/(homepage)/[id]",
          params: { id: userId.toString() },
        });
      }
    } catch (error) {}
  };

  const updateProfile = async ({ avatar_url }: { avatar_url: string }) => {
    try {
      //   setLoading(true);
      //   if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        avatar_url,
      };

      //   let { error } = await supabase.from("profiles").upsert(updates);
      console.log("avatar_url", avatar_url);
      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatar_url,
        })
        .eq("id", userId)
        .select();

      if (data) {
        console.log("Data", data);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("error", error.message);
      }
      // } finally {
      //   setLoading(false);
      // }
    }
  };

  const handleDisplayNameChange = (_displayName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          displayName: _displayName,
        };
      }
      return null; // or any other default value if needed
    });
  };

  const handleFirstNameChange = (_firstName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          firstName: _firstName,
        };
      }
      return null; // or any other default value if needed
    });
  };

  const handleLastNameChange = (_lastName: string) => {
    setProfileInfo((prevProfileInfo) => {
      if (prevProfileInfo) {
        return {
          ...prevProfileInfo,
          lastName: _lastName,
        };
      }
      return null; // or any other default value if needed
    });
  };

  /** useEffects */
  useEffect(() => {
    const fetchprofileInfo = async () => {
      try {
        const profile: ProfileInfo | null = await getProfileInfo(
          userId.toString()
        );

        if (profile) {
          setProfileInfo(profile);
          setAvatarUrl(profile?.avatar_url);
          console.log("AvatarUrl", profile?.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching profile info:", error);
        setProfileInfo(null);
      }
    };
    fetchprofileInfo();
  }, [userId]);

  return (
    <OuterContainer
      padding="$2"
      gap="$2"
      backgroundColor={"whitesmoke"}
      height={height}
    >
      <BodyContainer
        height={height * 0.86}
        borderBottomRightRadius={"$11"}
        borderBottomLeftRadius={"$11"}
      >
        {/* <Text>{userId}</Text>
          <Text>{JSON.stringify(profileInfo)}</Text> */}
        <Form onSubmit={onSave} rowGap="$3" borderRadius="$4" padding="$3">
          <YStack height={height * 0.75} gap={"$2"}>
            <View paddingVertical={"$5"}>
              <Avatar
                size={200}
                url={avatarUrl}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                  updateProfile({ avatar_url: url });
                }}
              />
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
                  id="email=profile"
                  placeholder="Email"
                  defaultValue={profileInfo?.email}
                  value={profileInfo?.email}
                  backgroundColor={"$gray"}
                  disabled
                />
              </Fieldset>
            </XStack>
          </YStack>

          <XStack justifyContent="flex-end">
            {/* <Link href={"/"} replace asChild>
              <Button onPress={signOutUser}>Cancel</Button>
            </Link> */}
            <Form.Trigger asChild>
              <Button> Save</Button>
            </Form.Trigger>
          </XStack>
        </Form>
      </BodyContainer>
      {/* <FooterContainer
        justifyContent="space-between"
        height={height}
      ></FooterContainer> */}
    </OuterContainer>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 16, // Add some bottom margin for spacing
  },
});
