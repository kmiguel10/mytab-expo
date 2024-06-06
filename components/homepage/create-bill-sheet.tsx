import { formatDateToYMD } from "@/lib/helpers";
import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import DatePicker from "react-native-date-picker";
import * as RNIap from "react-native-iap";
import {
  Card,
  H4,
  H6,
  ListItem,
  Separator,
  Sheet,
  Text,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { StyledButton } from "../button/button";
import { StyledInput } from "../input/input";

import moment from "moment";
import "moment-timezone";

/**
 *
 * @returns Display Plans and Payment UI
 */

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * Dates send to the Database are in UTC, all the calculations will be in UTC except what is shown to the user which will be transformed to localTime
 */
const CreateBillSheet: React.FC<Props> = ({ open, setOpen }) => {
  /** ---------- States and Variables ---------- */
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [position, setPosition] = useState(0);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [billName, setBillName] = useState("");
  const [billNameError, setBillNameError] = useState(false);
  const [isBillActive, setIsBillActive] = useState(false);

  // Dates are initialized in Local Time Zone
  const [date, setDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  // Default is 7 days
  const [planDuration, setPlanDuration] = useState(7);
  const [openDate, setOpenDate] = useState(false);

  const [payButtonHeight, setPayButtonHeight] = useState(windowHeight * 0.57);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productIds = ["com.mytab.1week", "com.mytab.2weeks"];
  const [products, setProducts] = useState<RNIap.Product[]>([]);

  /** ---------- Functions ---------- */

  const onPlanSelected = (productId: string) => {
    setIsPlanSelected(true);
    setDate(moment()); //current date
    setSelectedPlan(productId);

    // 2 week plan
    if (productId === "com.mytab.2weeks") {
      setPlanDuration(14);

      const newEndDate = moment();
      newEndDate.add(14, "days");
      setEndDate(newEndDate);
      setSelectedProductId("com.mytab.2weeks");
    } else {
      setPlanDuration(7);

      const newEndDate = moment();
      newEndDate.add(7, "days");
      setEndDate(newEndDate);
      setSelectedProductId("com.mytab.1week");
    }
  };

  // const onCreateBill = async () => {
  //   try {
  //     if (selectedProductId) {
  //       console.log("Product Id: ", selectedProductId);

  //       await RNIap.requestPurchase({
  //         sku: selectedProductId,
  //         andDangerouslyFinishTransactionAutomaticallyIOS: false,
  //       });
  //       console.log("Finished request purchase", selectedProductId);
  //     } else {
  //       console.error("Error: No product selected");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  /**
   * At this point the DatePicker has converted the dates to UTC so no need for conversion when sending it to the database
   */
  const onCreateBill = async () => {
    // try {
    //   if (selectedProductId) {
    //     console.log("Product Id: ", selectedProductId);
    //     await RNIap.requestPurchase({ sku: selectedProductId });
    //   } else {
    //     console.error("Error: No product selected");
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }

    // if (!billName) {
    //   console.error("Error: Name cannot be null");
    //   return;
    // }

    const { data, error } = await supabase
      .from("bills")
      .insert([
        {
          ownerid: id,
          name: billName,
          start_date: date.utc(), //UTC
          end_date: endDate.utc(), //UTC
          isActive: isBillActive,
        },
      ])
      .select();

    if (data && data.length > 0) {
      setOpen(false);
      const newBillData: BillData = data[0] as BillData;
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
      });
    } else {
      if (error) {
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorCreateMessage: "Error creating bill" },
        });
      }
    }
  };

  const onOpenChange = () => {
    setOpen(!open);
    setIsPlanSelected(false);
    setSelectedPlan(null);
    setPlanDuration(7);
    setDate(moment());
    setBillName("");

    const newEndDate = moment();
    // newEndDate.setDate(newEndDate.getDate() + 7);
    newEndDate.add(7, "days");
    setEndDate(newEndDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", { month: "long", day: "numeric" });
  };

  const onBillNameInput = (_billName: string) => {
    if (_billName.length <= 20) {
      setBillName(_billName);
      setBillNameError(false);
    } else {
      setBillNameError(true);
    }
  };

  const onBackClick = () => {
    setIsPlanSelected(false);
    setSelectedPlan(null);
    setPlanDuration(7);
    setDate(moment());
    setBillName("");

    const newEndDate = moment();
    //newEndDate.setDate(newEndDate.getDate() + 7);
    newEndDate.add(7, "days");
    setEndDate(newEndDate);
  };

  const minDate = new Date();
  const maxDate = new Date(
    minDate.getFullYear(),
    minDate.getMonth(),
    minDate.getDate() + 30
  );

  const handlePurchase = async (productId: any) => {
    try {
      await RNIap.requestPurchase(productId);
    } catch (err) {
      console.warn(err);
    }
  };

  /** ---------- Listeners ---------- */
  // Listen for keyboard show/hide events
  Keyboard.addListener("keyboardDidShow", () => {
    setPayButtonHeight(windowHeight * 0.2);
  });

  Keyboard.addListener("keyboardDidHide", () => {
    setPayButtonHeight(windowHeight * 0.55);
  });

  /** ---------- UseEffect ---------- */

  useEffect(() => {
    const currentDate = moment();

    //console.log("Current Date local: ", currentDate.toString());
    //Need to rethink this...
    if (currentDate >= date && currentDate <= endDate) {
      //Bill is sent to active Tab
      setIsBillActive(true);
    } else {
      //Bills is sent to Inactive tab
      setIsBillActive(false);
    }
  }, [date, endDate, minDate, maxDate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await RNIap.getProducts({ skus: productIds });
        //console.log("Products fetched: ", products);
        setProducts(products);
      } catch (err) {
        console.warn(err);
      }
    };
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  //     (purchase) => {
  //       console.log("********** Purchase Updated: ", purchase);
  //       if (purchase.transactionReceipt) {
  //         // Handle purchase confirmation here
  //         console.log(
  //           "Purchase successful with receipt: ",
  //           purchase.transactionReceipt
  //         );
  //         Alert.alert("Purchase Successful", "Thank you for your purchase!");
  //         RNIap.finishTransaction({ purchase, isConsumable: true });

  //         // Close the sheet after successful purchase
  //         setOpen(false);
  //       }
  //     }
  //   );

  //   const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
  //     console.warn("Purchase Error: ", error);
  //     Alert.alert("Purchase Error", "An error occurred during the purchase.");
  //   });

  //   return () => {
  //     if (purchaseUpdateSubscription) {
  //       purchaseUpdateSubscription.remove();
  //     }
  //     if (purchaseErrorSubscription) {
  //       purchaseErrorSubscription.remove();
  //     }
  //   };
  // });

  useEffect(() => {
    console.log("*********Date and EndDate");
    console.log("Date: ", date.toLocaleString());
    console.log("End Date ", endDate.toLocaleString());
    // const now = moment();
    // const offSet = date.utcOffset();
    // const offSetNow = now;
    // const todayMoment = moment();
    // console.log("Now", now.toLocaleString());
    // console.log("Timezone offset", offSet, offSetNow);
    // console.log("Today moment: ", todayMoment.toLocaleString());
    // console.log("Today moment utc: ", todayMoment.utc());
    // console.log("Today moment utc: ", todayMoment.utcOffset());
  }, [date, endDate]);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal={true}
      open={open}
      onOpenChange={() => onOpenChange()}
      snapPoints={isPlanSelected ? [90] : [50]}
      snapPointsMode={"percent"}
      dismissOnSnapToBottom
      position={position}
      onPositionChange={setPosition}
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame padding="$4" justifyContent="flex-start" gap="$5">
        <YStack>
          {isPlanSelected ? (
            <StyledButton
              width={windowWidth * 0.2}
              size={"$3"}
              onPress={onBackClick}
            >
              Back
            </StyledButton>
          ) : (
            <XStack justifyContent="flex-start">
              <H4>Select a plan:</H4>
            </XStack>
          )}

          <Separator marginVertical={"$3"} />
          <YGroup alignSelf="center" width={"100%"} size="$5" gap="$2">
            <YGroup.Item>
              {products.map((product, index) => (
                <ListItem
                  key={product.productId}
                  hoverTheme
                  title={<H6 fontSize={"$4"}>{product.title}</H6>}
                  subTitle={product.description}
                  iconAfter={
                    <StyledButton
                      size="$3"
                      active={true}
                      onPress={() => onPlanSelected(product.productId)}
                      disabled={isPlanSelected}
                    >
                      {"  "}
                      {product.price}
                      {"  "}
                    </StyledButton>
                  }
                  size={"$5"}
                  borderRadius={"$4"}
                  display={
                    isPlanSelected && selectedPlan !== product.productId
                      ? "none"
                      : "flex"
                  }
                />
              ))}
            </YGroup.Item>
          </YGroup>
          {isPlanSelected && (
            <>
              <Separator marginVertical={"$3"} />
              <View gap="$4.5" height={payButtonHeight}>
                <Card
                  bordered
                  backgroundColor="white"
                  borderRadius={"$5"}
                  height={windowHeight * 0.2}
                >
                  <YStack gap="$2" margin="$3.5">
                    <Text>Bill Name</Text>
                    <StyledInput
                      placeholder="Ex: Mexico Trip"
                      value={billName}
                      onChangeText={onBillNameInput}
                      error={billNameError}
                    />
                  </YStack>
                  <YStack marginHorizontal="$3.5">
                    <Text>Duration</Text>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text alignItems="center">
                        {date.format("MMM D")}- {endDate.format("MMM D")}
                      </Text>
                      <StyledButton
                        size={"$3.5"}
                        active={true}
                        onPress={() => setOpenDate(true)}
                      >
                        Select Date
                      </StyledButton>
                    </XStack>
                  </YStack>
                  {/* Date picker receive date in localTime and converts it to UTC */}
                  <DatePicker
                    modal
                    mode={"date"}
                    open={openDate}
                    date={date.utc().toDate()}
                    minimumDate={new Date()}
                    maximumDate={maxDate}
                    onConfirm={(date) => {
                      //Date is in UTC
                      setOpenDate(false);
                      setDate(moment(date));

                      //Set new end date
                      const newEndDate = moment(date);
                      newEndDate.add(planDuration, "days");
                      setEndDate(moment(newEndDate));

                      console.log("***** onConfirm *****");
                      console.log("date: ", date);
                      console.log(
                        "end date: ",
                        newEndDate.add(planDuration, "days")
                      );
                    }}
                    onCancel={() => {
                      setOpenDate(false);
                    }}
                  />
                </Card>
              </View>
              <View paddingTop="$2">
                <StyledButton
                  create={!!billName && !billNameError}
                  disabled={!billName || billNameError}
                  onPress={onCreateBill}
                >
                  Pay
                </StyledButton>
              </View>
            </>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CreateBillSheet;
