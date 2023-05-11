import { Div, T } from "@components/index";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { Pressable, PressableProps } from "react-native";

interface ActionItemIconProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItemIcon = ({ children }: ActionItemIconProps) => {
  return <Div>{children}</Div>;
};

interface ActionItemTitleProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItemTitle = ({ children }: ActionItemTitleProps) => {
  return (
    <T className={`font-figtree-semi-bold text-white text-lg`}>{children}</T>
  );
};

// extends Pressable
interface ActionItemProps extends PressableProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItem = ({ children, ...other }: ActionItemProps) => {
  return (
    <Pressable {...other}>
      <Div
        className={`flex items-center justify-start flex-row py-5 g-6 px-12`}
      >
        {children}
      </Div>
    </Pressable>
  );
};

interface ActionSheetProps {
  children?: React.ReactNode | React.ReactNode[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActionSheet = ({
  children,
  onOpenChange,
  open,
}: ActionSheetProps) => {
  const snapPoints = useMemo(() => ["30%"], []);
  const sheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: "black" }}
      // backdropComponent={({ animatedIndex, animatedPosition }) => {
      //   const containerAnimatedStyle = useAnimatedStyle(() => ({
      //     opacity: interpolate(
      //       animatedIndex.value,
      //       [-1, 0],
      //       [0, 0.3],
      //       Extrapolate.CLAMP
      //     ),
      //   }));
      //   return (
      //     <Pressable
      //       style={{
      //         position: "absolute",
      //         top: 0,
      //         bottom: 0,
      //         left: 0,

      //         right: 0,
      //       }}
      //       onPress={() => {
      //         sheetRef.current?.close();
      //         onOpenChange(false);
      //       }}
      //     >
      //       <Animated.View
      //         style={[
      //           {
      //             backgroundColor: "black",
      //             flex: 1,
      //             zIndex: 999,
      //           },
      //           containerAnimatedStyle,
      //         ]}
      //       />
      //     </Pressable>
      //   );
      // }}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      onClose={() => {
        onOpenChange(false);
      }}
      enablePanDownToClose={true}
      ref={sheetRef}
      index={open ? 0 : -1}
      handleStyle={{
        // backgroundColor: "red",
        paddingTop: 12,
        paddingBottom: 28,
      }}
      snapPoints={snapPoints}
    >
      <BottomSheetScrollView
        style={{
          flex: 1,
        }}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

ActionSheet.Item = ActionItem;
ActionSheet.ItemTitle = ActionItemTitle;
ActionSheet.ItemIcon = ActionItemIcon;
