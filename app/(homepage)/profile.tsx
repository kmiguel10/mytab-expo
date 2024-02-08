import { Button, StyleSheet, View } from "react-native";
import { Text } from "tamagui";

import { supabase } from "@/lib/supabase";

import { Link, Redirect, useLocalSearchParams } from "expo-router";

const signOutUser = async () => {
  await supabase.auth.signOut();
  console.log("USER SIGNED OUT");
  // <Redirect href="/(homepage)/home" />;
};

export default function TabTwoScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text>Tab Two: {id}</Text>
      {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
      <Text>This will show all profile info and log out button</Text>
      <Link href={"/"} replace asChild>
        <Button title="Return to Home / Logout" onPress={signOutUser} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
