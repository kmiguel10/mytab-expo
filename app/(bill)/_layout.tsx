import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import { ArrowBigLeft, Home, Settings2 } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Button, Text, View } from "tamagui";
import { useRoute } from "@react-navigation/native";
import BillScreen from "./[id]";
import EditBill from "./edit-bill";

const Layout = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as {
    id: string;
  };

  /** States */
  const [session, setSession] = useState<Session | null>(null);
  const [sessionUserId, setSessionUserId] = useState("");
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [billName, setBillName] = useState("");
  let [counter, setCounter] = useState(0);

  /** Functions */
  const handleHomeButtonClick = () => {
    setCounter(counter++);
    if (sessionUserId) {
      router.replace({
        pathname: "/(homepage)/[id]",
        params: { id: sessionUserId },
      });
    } else {
      console.error("UserId does not exist");
    }
  };

  const handleReturnToMyBill = () => {
    console.log("counter", counter);
    setCounter(counter++);
    router.replace({
      pathname: `/(bill)/[id]`,
      params: { id: id },
    });
    setCounter(counter++);
  };

  /** Use Effects */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      setSessionUserId(session?.user.id);
    }
  }, [session]);

  useEffect(() => {
    async function fetchBillInfo() {
      if (id) {
        const data: BillInfo[] | null = await getBillInfo(Number(id));
        setIsBillLocked(data[0].isLocked);
        setBillName(data[0].name);
      }
    }
    fetchBillInfo();
  }, [id, sessionUserId, counter]);

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "",
          headerTitle: () =>
            isBillLocked ? (
              <View
                backgroundColor={"$red4Light"}
                paddingHorizontal={"$2"}
                paddingVertical={"$1"}
                alignItems="center"
                borderRadius={"$12"}
              >
                <Text fontSize={"$1"}>Locked</Text>
              </View>
            ) : (
              ""
            ),
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={handleHomeButtonClick}>
              <Home />
            </Pressable>
          ),
          headerRight: () => (
            <Link
              href={{
                pathname: "/(bill)/edit-bill",
                params: {
                  id: id,
                  userId: sessionUserId,
                },
              }}
              asChild
            >
              <Pressable>
                <Settings2 />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="edit-bill"
        options={{
          title: "Bill Settings",
          headerLeft: () => (
            <Pressable onPress={handleReturnToMyBill}>
              <Text>{billName.slice(0, 5)}...</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
