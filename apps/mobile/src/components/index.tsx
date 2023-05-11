import { Image } from "expo-image";
import { styled } from "nativewind";
import { Text as Te, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export const Div = styled(View);
export const Text = styled(Te);
export const StyledInput = styled(TextInput);
export const Img = styled(Image);
export const T = styled(Te);

export const ADiv = Animated.createAnimatedComponent(Div);

export const DivScroll = styled(ScrollView);

export const CoverTextShadowStyle = {
  textShadowColor: "rgba(0, 0, 0, 0.75)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 2,
};
