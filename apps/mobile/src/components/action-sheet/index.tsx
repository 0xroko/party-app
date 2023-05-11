import { Div, T } from "@components/index";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { createRef, useCallback, useMemo } from "react";
import {
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ActionItemIconProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItemIcon = ({ children }: ActionItemIconProps) => {
  return <Div>{children}</Div>;
};

interface ActionItemTitleProps extends TextProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItemTitle = ({ children, ...o }: ActionItemTitleProps) => {
  return (
    <T className={`font-figtree-semi-bold text-white text-lg`} {...o}>
      {children}
    </T>
  );
};

// extends Pressable
interface ActionItemProps extends TouchableOpacityProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const ActionItem = ({ children, ...other }: ActionItemProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...other}>
      <Div
        className={`flex items-center justify-start flex-row py-5 g-6 px-12`}
      >
        {children}
      </Div>
    </TouchableOpacity>
  );
};

interface ActionSheetProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const actionSheetRef = createRef<BottomSheet>();

export const ActionSheet = ({ children }: ActionSheetProps) => {
  const snapPoints = useMemo(() => ["30%"], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: "black" }}
      backdropComponent={renderBackdrop}
      index={-1}
      handleIndicatorStyle={{
        backgroundColor: "white",
      }}
      enablePanDownToClose={true}
      ref={actionSheetRef}
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
