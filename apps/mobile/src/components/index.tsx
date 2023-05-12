import { Image } from "expo-image";
import { styled } from "nativewind";
import { Pressable, Text as Te, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export const Div = styled(View);
export const Text = styled(Te);
export const StyledInput = styled(TextInput);
export const Img = styled(Image);
export const T = styled(Te);

export const ADiv = Animated.createAnimatedComponent(Div);

export const PlaceHolderUserImage = require("../assets/pfp.png");

export const StyledScrollDiv = styled(ScrollView);
export const DivScroll = styled(ScrollView);
export const PressableDiv = styled(Pressable);

export const CoverTextShadowStyle = {
  textShadowColor: "rgba(0, 0, 0, 0.75)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 2,
};

export const PageMargin = "mx-[18px]";

export const placeHolderBaseImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgB7dFBAQAgDAChaYf1j6o17gEVOLv7how7pAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERIjJEZIjJAYITFCYoTECIkREiMkRkiMkBghMUJihMQIiRESIyRGSIyQGCExQmKExAiJERLzAWryAgaCD7znAAAAAElFTkSuQmCC";

interface PageTitleProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <T
      className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
    >
      {children}
    </T>
  );
};

export const EmptyPageMessage = ({ children }: PageTitleProps) => {
  return (
    <Div className={`h-52 flex justify-center items-center`}>
      <Text
        className={`text-lg font-figtree-medium text-accents-8 text-center mb-8 mt-2`}
      >
        {children}
      </Text>
    </Div>
  );
};
