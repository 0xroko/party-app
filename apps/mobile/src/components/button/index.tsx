import { Div, Text } from "@components/index";
import { cva, type VariantProps } from "class-variance-authority";
import { styled } from "nativewind";
import { Pressable, TouchableOpacityProps } from "react-native";

const buttonStyles = cva("justify-center items-center rounded-full flex-row", {
  variants: {
    intent: {
      primary: "bg-accents-12 text-accents-1 hover:bg-accents-11",
      secondary: "bg-accents-1 text-accents-12 border border-accents-12",
      disabled: "bg-accents-2 text-accents-6",
    },
    size: {
      medium: "text-base h-10",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "medium",
  },
});

const buttonTextStyles = cva("", {
  variants: {
    intent: {
      primary: "text-accents-1",
      secondary: "text-accents-12",
      disabled: "text-accents-6",
    },
  },
});

type MyButtonProps = VariantProps<typeof buttonStyles>;

interface ButtonProps
  extends Omit<MyButtonProps, "leadingIcon" | "trailingIcon">,
    TouchableOpacityProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  disabled?: boolean;
  leadingIcon?: React.ReactNode | React.ReactNode[];
  trailingIcon?: React.ReactNode | React.ReactNode[];
}

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const AnimatedView = styled(Animated.View);
export const Button = ({
  children,
  size,
  className,
  intent,
  leadingIcon,
  trailingIcon,
  disabled,
  ...o
}: ButtonProps) => {
  let intentI = intent;

  if (disabled) intentI = "disabled";

  const style = buttonStyles({
    intent: intentI,
    size,
  });

  if (disabled) {
    o.onPress = () => {};
    o.onPressIn = () => {};
    o.onPressOut = () => {};
    o.onLongPress = () => {};
  }

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 77,
        easing: Easing.exp,
      }),
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 77,
            easing: Easing.exp,
          }),
        },
      ],
    };
  });

  return (
    <Pressable
      {...o}
      onPressIn={() => {
        if (!disabled) {
          scale.value = 0.98;
          opacity.value = 0.8;
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          setTimeout(() => {
            scale.value = 1;
            opacity.value = 1;
          }, 100);
        }
      }}
    >
      <AnimatedView className={style} style={[customSpringStyles]}>
        {leadingIcon && <Div className={`mr-2`}>{leadingIcon}</Div>}
        <Text
          className={`${buttonTextStyles({
            intent: intentI,
          })} ${className} font-figtree-bold`}
        >
          {children}
        </Text>
        {trailingIcon && <Div className={`ml-2`}>{trailingIcon}</Div>}
      </AnimatedView>
    </Pressable>
  );
};
