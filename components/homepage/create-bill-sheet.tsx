import { supabase } from "@/lib/supabase";
import { BillData } from "@/types/global";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import * as RNIap from "react-native-iap";
import {
  Card,
  H4,
  H6,
  ListItem,
  Separator,
  Sheet,
  SizableText,
  Spinner,
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
  isFreeBillActive: boolean;
}

/**
 * Dates send to the Database are in UTC, all the calculations will be in UTC except what is shown to the user which will be transformed to localTime
 */
const CreateBillSheet: React.FC<Props> = ({
  open,
  setOpen,
  isFreeBillActive,
}) => {
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

  // Dates are initialized in Local Time Zone
  const [date, setDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const [payButtonHeight, setPayButtonHeight] = useState(windowHeight * 0.57);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productIds = ["com.mytab.1week", "com.mytab.2weeks"];
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const freeProduct = {
    title: "Free Plan",
    description: "1 Week, 2 users, 20 entries",
    productId: "free.plan",
    price: "Free",
  };

  /** ---------- Functions ---------- */

  const onPlanSelected = (productId: string) => {
    setIsPlanSelected(true);
    setDate(moment()); //current date
    setSelectedPlan(productId);

    // 2 week plan
    if (productId === "com.mytab.2weeks") {
      const newEndDate = moment();
      newEndDate.add(14, "days");
      setEndDate(newEndDate);
      setSelectedProductId("com.mytab.2weeks");
    } else {
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
   * 1. Initialize in app purchase payment
   * 2. If successfull create bill
   * 3. if error return to homepage [id]
   */
  // const onCreateBill = async () => {
  //   try {
  //     if (selectedProductId) {
  //       console.log("Product Id: ", selectedProductId);
  //       const purchase = await RNIap.requestPurchase({
  //         sku: selectedProductId,
  //       });

  //       console.log("Purchase: ", purchase);
  //     } else {
  //       console.error("Error: No product selected");
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }

  //   //Create bill

  //   let isFree = selectedPlan === "free.plan" ? true : false;

  //   const { data, error } = await supabase
  //     .from("bills")
  //     .insert([
  //       {
  //         ownerid: id,
  //         name: billName,
  //         start_date: date.utc(), //UTC
  //         end_date: endDate.utc(), //UTC
  //         isActive: true,
  //         isFree: isFree,
  //         productId: selectedPlan,
  //       },
  //     ])
  //     .select();

  //   if (data && data.length > 0) {
  //     setOpen(false);
  //     const newBillData: BillData = data[0] as BillData;
  //     router.replace({
  //       pathname: `/(homepage)/${id}`,
  //       params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
  //     });
  //   } else {
  //     if (error) {
  //       router.replace({
  //         pathname: `/(homepage)/${id}`,
  //         params: { errorCreateMessage: "Error creating bill" },
  //       });
  //     }
  //   }
  // };

  /**
   * 1. Free plan will not prompt payment
   * 2. Paid plans will promt payment
   */
  const onCreateBill = async () => {
    try {
      if (selectedProductId) {
        console.log("Product Id: ", selectedProductId);

        let purchase: void | RNIap.ProductPurchase | RNIap.ProductPurchase[] =
          undefined;
        setIsLoading(true);

        // Request purchase and wait for the response
        if (selectedPlan !== "free.plan") {
          try {
            purchase = await RNIap.requestPurchase({
              sku: selectedProductId,
            });
          } catch (purchaseError) {
            console.error("Error during purchase:", purchaseError);
            setIsLoading(false);
            // Redirect or handle purchase error
            //This is triggered when cancelling the purchase...
            router.replace({
              pathname: `/(homepage)/${id}`,
              params: { errorCreateMessage: "Purchase is cancelled" },
            });
            return; // Exit the function as the purchase failed
          }
        }

        // Handle the purchase response
        if (purchase || selectedPlan === "free.plan") {
          console.log("Purchase successful for this plan:", purchase);

          // Create the bill only if the purchase is successful
          let isFree = selectedPlan === "free.plan";

          const { data, error } = await supabase
            .from("bills")
            .insert([
              {
                ownerid: id,
                name: billName,
                start_date: date.utc(), // UTC
                end_date: endDate.utc(), // UTC
                isActive: true,
                isFree: isFree,
                productId: selectedPlan,
              },
            ])
            .select();

          if (data && data.length > 0) {
            setOpen(false);
            const newBillData: BillData = data[0] as BillData;
            setIsLoading(false);
            router.replace({
              pathname: `/(homepage)/${id}`,
              params: { newBillId: newBillData?.billid ?? null }, // Add userId to params
            });
          } else {
            console.error("Error creating bill:", error);
            setIsLoading(false);
            router.replace({
              pathname: `/(homepage)/${id}`,
              params: { errorCreateMessage: "Error creating bill" },
            });
          }
        } else {
          // Error with purchase
          console.error(
            "Error: Purchase was not successful or no purchase made for free plan"
          );
          setIsLoading(false);
          router.replace({
            pathname: `/(homepage)/${id}`,
            params: { errorCreateMessage: "Error creating bill" },
          });
        }
      } else {
        console.error("Error: No product selected");
        setIsLoading(false);
        router.replace({
          pathname: `/(homepage)/${id}`,
          params: { errorCreateMessage: "No product selected" },
        });
      }
    } catch (err) {
      console.warn("Unexpected error:", err);
      setIsLoading(false);
      router.replace({
        pathname: `/(homepage)/${id}`,
        params: { errorCreateMessage: "Unexpected error occurred" },
      });
    }
  };

  const onOpenChange = () => {
    setOpen(!open);
    setIsPlanSelected(false);
    setSelectedPlan(null);
    setDate(moment());
    setBillName("");

    const newEndDate = moment();
    newEndDate.add(7, "days");
    setEndDate(newEndDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", { month: "long", day: "numeric" });
  };

  const onBillNameInput = (_billName: string) => {
    // Trim the input to remove leading and trailing spaces
    const trimmedBillName = _billName.trim();

    // Check if the trimmed bill name is empty or exceeds the character limit
    if (trimmedBillName.length === 0) {
      setBillNameError(true);
      setBillName(_billName); // Optionally set the original bill name with spaces for the user to see
    } else if (trimmedBillName.length <= 20) {
      setBillName(_billName); // Set the original input to keep the spaces as the user entered them
      setBillNameError(false);
    } else {
      setBillNameError(true);
    }
  };

  const onBackClick = () => {
    setIsPlanSelected(false);
    setSelectedPlan(null);
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

  //Fetches Products for In App Purchases
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await RNIap.getProducts({ skus: productIds });
        console.log("*** Products fetched: ", JSON.stringify(products));
        setProducts(products);
      } catch (err) {
        console.warn(err);
      }
    };
    fetchProducts();
  }, []);

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
        {isLoading ? (
          <YStack
            padding="$3"
            alignItems="center"
            justifyContent="center"
            height="60%" // Make sure the stack takes the full height of the viewport
          >
            <Spinner size="large" color="$green10" />
          </YStack>
        ) : (
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
                <ListItem
                  key={1}
                  hoverTheme
                  title={<H6 fontSize={"$4"}>{freeProduct.title}</H6>}
                  subTitle={freeProduct.description}
                  iconAfter={
                    <StyledButton
                      size="$3"
                      active={true}
                      onPress={() => onPlanSelected(freeProduct.productId)}
                      disabled={isPlanSelected}
                    >
                      {"  "}
                      {freeProduct.price}
                      {"  "}
                    </StyledButton>
                  }
                  size={"$5"}
                  borderRadius={"$4"}
                  display={
                    isPlanSelected && selectedPlan !== "free.plan"
                      ? "none"
                      : "flex"
                  }
                />
                {products.map((product, index) => (
                  <ListItem
                    key={product.productId + index}
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
                  {selectedPlan === "free.plan" && isFreeBillActive ? (
                    <Card
                      bordered
                      backgroundColor="white"
                      borderRadius={"$5"}
                      height={windowHeight * 0.2}
                    >
                      <SizableText>
                        Cannot create a free bill while there is an active free
                        bill
                      </SizableText>
                    </Card>
                  ) : (
                    <Card
                      bordered
                      backgroundColor="white"
                      borderRadius={"$5"}
                      height={windowHeight * 0.2}
                    >
                      <YStack gap="$2" margin="$3.5">
                        <H6>Bill Name</H6>
                        <StyledInput
                          placeholder="Ex: Mexico Trip"
                          value={billName}
                          onChangeText={onBillNameInput}
                          error={billNameError}
                          maxLength={20}
                        />
                      </YStack>
                      <YStack marginHorizontal="$3.5" gap="$2">
                        <H6>Duration</H6>
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <SizableText>
                            {date.format("MMM D")} - {endDate.format("MMM D")}
                          </SizableText>
                        </XStack>
                      </YStack>
                    </Card>
                  )}
                </View>
                <View paddingTop="$2">
                  {selectedPlan === "free.plan" && isFreeBillActive ? (
                    <Text>Expand the current free bill?</Text>
                  ) : (
                    <StyledButton
                      create={!!billName && !billNameError}
                      disabled={!billName || billNameError}
                      onPress={onCreateBill}
                    >
                      Pay
                    </StyledButton>
                  )}
                </View>
              </>
            )}
          </YStack>
        )}
      </Sheet.Frame>
    </Sheet>
  );
};

export default CreateBillSheet;
