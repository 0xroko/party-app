import { Button } from "@components/button";
import { Div, T } from "@components/index";
import { SafeArea } from "@components/safe-area";
import BottomSheet from "@gorhom/bottom-sheet";
import { useAuthUser } from "@hooks/useAuthUser";
import { User } from "@lib/actions";
import { getRandomUserButNotMe } from "@lib/actions/user";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FC, useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import { useQuery } from "react-query";

const useRandomUser = () => {
  const q = useQuery("random-user", async () => {
    return (await getRandomUserButNotMe()) as User;
  });

  return q;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  sheetContainer: {
    // add horizontal space
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export const ModalScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user-modal">
> = ({ navigation, route }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // listen to a change event from react-navigation to trigger bottom sheet close method.
  // variables
  const snapPoints = useMemo(() => ["25%"], []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        navigation.goBack();
      }
    },
    [navigation]
  );
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={() => (
        <Div className={`bg-glass-1 absolute inset-0`}></Div>
      )}
      // add bottom inset to elevate the sheet
      enablePanDownToClose
      enableOverDrag
      onClose={() => {}}
      enableHandlePanningGesture
      enableContentPanningGesture
      // set `detached` to true
      onChange={handleSheetChanges}
      style={styles.sheetContainer}
    >
      <Div className={``}>
        <T>Awesome 🎉</T>
      </Div>
    </BottomSheet>
  );
};

export const HomeScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const { data, isFetched, refetch } = useAuthUser();

  const { data: randomUserData, isFetched: randomUserFetched } =
    useRandomUser();

  return (
    <SafeArea gradient>
      <Div className={`justify-evenly mx-[22px] flex h-full`}>
        <Div className={`flex flex-col g-2`}>
          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: data?.user.id,
                previousScreenName: "Home",
              });
            }}
          >
            My Profile
          </Button>

          <Button
            disabled={!isFetched}
            onPress={() => {
              navigation.navigate("user", {
                id: randomUserData?.id,
                previousScreenName: "Home",
              });
            }}
          >
            {randomUserData?.displayname}
          </Button>
          <Button
            // disabled={!isFetched}
            onPress={() => {
              navigation.navigate("party-add");
            }}
          >
            add party
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("chats");
            }}
          >
            chats
          </Button>
          <Button
            onPress={() => {
              navigation.navigate("upload-images");
            }}
          >
            Upload
          </Button>
          <Button
            onPress={() => {
              navigation.push("user-modal");
            }}
          >
            Dissmiss{" "}
          </Button>
        </Div>
      </Div>
    </SafeArea>
  );
};
