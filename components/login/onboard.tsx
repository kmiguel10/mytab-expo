import {
  useWindowDimensions,
  Text,
  Button,
  Form,
  XStack,
  Fieldset,
  Input,
  View,
  YStack,
} from "tamagui";
import { OuterContainer } from "../containers/outer-container";
import { BodyContainer } from "../containers/body-container";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ProfileInfo } from "@/types/global";
import { getProfileInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import Avatar from "./avatar";
import { StyledButton } from "../button/button";

interface Props {
  userId: string;
}

/**
 * Route here after sign up and only after sign up... meaning...
 * after initial sign up the user must provide a display name...
 *
 * redirect to homepage after sign in if display name exists
 * @param param0
 * @returns
 */
export const Onboard: React.FC<Props> = ({ userId }) => {
  const { width, height } = useWindowDimensions();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

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
          params: { id: userId },
        });
      }
    } catch (error) {
      console.log("Error onboarding user", error);
    }
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
    console.log("USER SIGNED OUT");
    // <Redirect href="/(homepage)/home" />;
  };

  //   const handleDisplayNameChange = (_displayName: string) => {
  //     //setName(txnName);
  //     // transaction.name = name;
  //     setProfileInfo((prevProfileInfo) => ({
  //       ...prevProfileInfo,
  //       displayName: _displayName,
  //     }));
  //   };
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

  const updateProfile = async ({ avatar_url }: { avatar_url: string }) => {
    try {
      //   setLoading(true);
      //   if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        avatar_url,
      };

      //   let { error } = await supabase.from("profiles").upsert(updates);

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

  useEffect(() => {
    const fetchprofileInfo = async () => {
      try {
        const profile: ProfileInfo | null = await getProfileInfo(userId);
        setProfileInfo(profile);

        setDisplayName(profile?.displayName || "");
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
      {!displayName ? (
        <BodyContainer
          height={height * 0.86}
          borderBottomRightRadius={"$11"}
          borderBottomLeftRadius={"$11"}
        >
          <Form onSubmit={onSave} rowGap="$3" borderRadius="$4" padding="$3">
            <YStack height={height * 0.75} gap={"$2"}>
              <View paddingVertical={"$5"}>
                <Avatar
                  url={avatarUrl}
                  onUpload={(url: string) => {
                    setAvatarUrl(url);
                    updateProfile({ avatar_url: url });
                  }}
                  size="$6"
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
                    id="email"
                    placeholder="Email"
                    defaultValue={profileInfo?.email}
                    value={profileInfo?.email}
                    backgroundColor={"$gray"}
                    disabled
                  />
                </Fieldset>
              </XStack>
            </YStack>
            <XStack justifyContent="space-between">
              <Button onPress={signOutUser}>Sign out</Button>
              <Form.Trigger asChild>
                <StyledButton create={true}> Save</StyledButton>
              </Form.Trigger>
            </XStack>
          </Form>
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
  );
};

export default Onboard;
