import { getBillInfo } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { BillInfo } from "@/types/global";
import { Session } from "@supabase/supabase-js";
import { ArrowBigLeft, Home, Settings2 } from "@tamagui/lucide-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Button, Text, View } from "tamagui";

const Layout = () => {
  const router = useRouter();
  const { id, billId, userId } = useLocalSearchParams();

  const [session, setSession] = useState<Session | null>(null);
  const [sessionUserId, setSessionUserId] = useState("");
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [billName, setBillName] = useState("");
  let [counter, setCounter] = useState(0);
  const handleHomeButtonClick = () => {
    setCounter(counter++);
    router.push(`/(homepage)/${sessionUserId}`);
  };

  const handleReturnToMyBill = () => {
    console.log("counter", counter);
    setCounter(counter++);
    router.push({
      pathname: `/(bill)/mybill/${id}`,
      params: { userId: sessionUserId },
    });
    setCounter(counter++);
  };

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
  }, [id, userId, counter]);

  //Create functions with params to route to Homepage and Bill Settings
  return (
    <Stack>
      <Stack.Screen
        name="mybill"
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
                  billId: billId,
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
        initialParams={{ id: id, billId: billId, userId: userId }}
      />
      <Stack.Screen
        name="edit-bill"
        options={{
          title: "Bill Settings",
          headerLeft: () => (
            // <Link
            //   href={{
            //     pathname: `/(bill)/mybill/${id}`,
            //     params: { userId: sessionUserId },
            //   }}
            //   asChild
            // >
            //   <Pressable>
            //     <ArrowBigLeft />
            //   </Pressable>
            // </Link>
            <Pressable onPress={handleReturnToMyBill}>
              {/* <ArrowBigLeft /> */}
              <Text>{billName.slice(0, 5)}...</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
