import { Image } from "expo-image";
import { styled } from "nativewind";
import { Text as Te, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";

export const Div = styled(View);
export const Text = styled(Te);
export const StyledInput = styled(TextInput);
export const Img = styled(Image);
export const T = styled(Te);

export const ADiv = Animated.createAnimatedComponent(Div);
