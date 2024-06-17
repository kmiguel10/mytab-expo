import { useState, useEffect } from "react";

import { StyleSheet, View, Alert, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { Avatar as AvatarTamagui, XStack, Button } from "tamagui";
import { StyledButton } from "../button/button";
interface Props {
  url: string | null;
  size: string;
  setUploading?: (uploading: boolean) => void;
  uploading?: boolean;
  onUpload?: (filePath: string) => void;
}

export default function Avatar({
  url,
  size = "$3",
  onUpload,
  setUploading,
  uploading,
}: Props) {
  //const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
    // console.log("URL", url);
    // console.log("avatar_url: ", avatarUrl);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) {
        throw error;
      }

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading?.(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      if (onUpload) {
        onUpload(data.path);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading?.(false);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <XStack alignItems="center" justifyContent="space-between">
          <AvatarTamagui circular size={size}>
            <AvatarTamagui.Image
              accessibilityLabel={"avatar"}
              src={avatarUrl}
            />
            <AvatarTamagui.Fallback delayMs={600} backgroundColor="$blue10" />
          </AvatarTamagui>
          {onUpload && (
            <View>
              <StyledButton
                onPress={uploadAvatar}
                disabled={uploading}
                size={"$2.5"}
                active={true}
              >
                {uploading ? "Uploading ..." : "Upload image"}
              </StyledButton>
            </View>
          )}
        </XStack>
      ) : (
        <XStack alignItems="center" justifyContent="space-between">
          <AvatarTamagui circular size={size}>
            {/* <AvatarTamagui.Image accessibilityLabel={"test"} src={avatarUrl} /> */}
            <AvatarTamagui.Fallback delayMs={600} backgroundColor="$blue10" />
          </AvatarTamagui>
          {onUpload && (
            <View>
              <StyledButton
                onPress={uploadAvatar}
                disabled={uploading}
                size={"$2.5"}
                active={true}
              >
                {uploading ? "Uploading ..." : "Upload image"}
              </StyledButton>
            </View>
          )}
        </XStack>
        // <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
    </View>
  );
}
