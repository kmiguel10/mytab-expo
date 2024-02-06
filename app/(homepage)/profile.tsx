import { Button, StyleSheet, View } from "react-native";
import { Text } from "tamagui";

import { Link } from "expo-router";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text>Tab Two</Text>
      {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
      <Text>This will show all profile info and log out button</Text>
      <Link href={"/"} replace asChild>
        <Button title="Return to Home / Logout" />
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
