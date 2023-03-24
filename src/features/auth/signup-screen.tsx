import { z } from "zod";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { styled, VariantProps, variants } from "nativewind";
import { FC, forwardRef } from "react";
import {
  StatusBar,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

import { ArrowSmallRightIcon, AtSymbolIcon } from "react-native-heroicons/mini";

interface SafeAreaProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const SafeArea = ({ children, className }: SafeAreaProps) => {
  console.log(Constants.statusBarHeight);

  return (
    <StyledView
      className={`flex flex-col justify-between  h-full bg-accents-1 text-accents-12`}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />
      <StyledView className={`${className} pt-[30]`}>{children}</StyledView>
    </StyledView>
  );
};

const buttonStyles = variants({
  variants: {
    intent: {
      primary: "bg-accents-12 text-accents-1",
      secondary: "bg-accents-1 text-accents-12 border border-accents-12",
    },
    size: {
      medium: "text-base h-11",
    },
  },
  className: "w-full justify-center items-center rounded-full flex-row",
  defaultProps: {
    intent: "primary",
    size: "medium",
  },
});

const buttonTextStyles = variants({
  variants: {
    intent: {
      primary: "text-accents-1 ",
      secondary: "text-accents-12 ",
    },
  },
});

type MyButtonProps = VariantProps<typeof buttonStyles>;

interface ButtonProps
  extends Omit<MyButtonProps, "leadingIcon" | "trailingIcon">,
    TouchableOpacityProps {
  children?: React.ReactNode | React.ReactNode[];
  leadingIcon?: React.ReactNode | React.ReactNode[];
  trailingIcon?: React.ReactNode | React.ReactNode[];
}

export const Button = ({
  children,
  size,
  intent,
  leadingIcon,
  trailingIcon,
  ...o
}: ButtonProps) => {
  const style = buttonStyles({
    intent,
    size,
  });

  return (
    <TouchableOpacity {...o}>
      <StyledView className={style}>
        {leadingIcon && (
          <StyledView className={`mr-2`}>{leadingIcon}</StyledView>
        )}
        <StyledText
          className={`${buttonTextStyles({ intent })} font-[figtreeBold]`}
        >
          {children}
        </StyledText>
        {trailingIcon && (
          <StyledView className={`ml-2`}>{trailingIcon}</StyledView>
        )}
      </StyledView>
    </TouchableOpacity>
  );
};

interface InputProps extends TextInputProps {
  children?: React.ReactNode | React.ReactNode[];
  leading?: React.ReactNode | React.ReactNode[];
  error?: string | undefined | null;
  disabled?: boolean;
  trailing?: React.ReactNode | React.ReactNode[];
}

export const Input = forwardRef(
  (
    { children, leading, error, disabled, trailing, ...p }: InputProps,
    ref: any
  ) => {
    const inputStyles = variants({
      variants: {
        leading: {
          false: "border-l rounded-l-full",
        },
        state: {
          error: "border-error-primary text-error-primary",
          disabled: "border-accents-4 text-accents-4",
          default: "border-accents-12 text-accents-12 ",
        },
      },
      className:
        "h-11 bg-accents-1 border flex flex-grow font-figtree-medium px-4 rounded-r-full flex-row",
    });

    const leadingStyles = variants({
      variants: {
        state: {
          error: "border-error-primary text-error-primary",
          disabled: "border-accents-4 text-accents-4",
          default: "border-accents-12 text-accents-12 ",
        },
      },
      className: "border-y border-l rounded-l-full  flex justify-center px-4 ",
    });

    // TODO: napp colors package jer nativewind ne radi s rel importima u tailwind.conf
    const placeHolderStyles = variants({
      variants: {
        state: {
          error: "#822025",
          disabled: "#232323",
          default: "#323232",
        },
      },
    });

    const state = disabled ? "disabled" : error ? "error" : "default";

    return (
      <StyledView>
        <StyledView
          className={`w-full flex flex-row h-11 text-accents-1 rounded-full mt-9`}
        >
          {leading && (
            <StyledView className={leadingStyles({ state })}>
              {leading}
            </StyledView>
          )}
          <StyledInput
            placeholderTextColor={placeHolderStyles({ state })}
            ref={ref}
            {...p}
            cursorColor={placeHolderStyles({ state })}
            editable={disabled ? false : p.editable}
            selectTextOnFocus={disabled ? false : p.selectTextOnFocus}
            className={inputStyles({ leading: !!leading, state })}
          ></StyledInput>
        </StyledView>
        {error && !disabled && (
          <StyledText className={`text-error-primary font-figtree-medium mt-3`}>
            <StyledText className={`font-figtree-bold`}>Greška: </StyledText>
            {error}
          </StyledText>
        )}
      </StyledView>
    );
  }
);

const phoneShema = z
  .string()
  .regex(/^[0-9]{9,15}$/, "Broj telefona nije validan");

export const LoginLoginScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "login-login">
> = ({ navigation }) => {
  // screen width and height
  const d = useWindowDimensions();
  console.log(d);

  return (
    <SafeArea>
      <Svg
        style={{
          position: "absolute",
          opacity: 0.7,
        }}
        height={d.height * 0.4}
        width={d.width}
      >
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%"
            cy="80%"
            r={"100%"}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0.536458" stopColor="#6500B7" stopOpacity="0" />
            <Stop offset="0.765625" stopColor="#6500B7" />
            <Stop offset="1" stopColor="#FFA0FF" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={"100%"} height={"100%"} fill="url(#grad)" />
      </Svg>
      <StyledView className={`mx-[22px] flex h-full justify-around`}>
        <StyledView className={``}>
          <StyledText
            className={`font-[figtreeBold] text-accents-12 text-[36px]`}
          >
            Kreiraj račun
          </StyledText>
          <StyledText
            className={`font-[figtreeMedium] text-accents-10 text-[18px] leading-7 mt-4`}
          >
            Koristimo brojeve kako bi lakše te spojili s prijataljima, uvijek ga
            možeš promjeniti
          </StyledText>
        </StyledView>
        <StyledView className={``}>
          <Input error={"ERR"} placeholder={"Broj telefona"}></Input>

          <Input
            error={"ERR"}
            leading={
              <StyledText className={`font-[figtreeMedium] text-accents-12`}>
                +387
              </StyledText>
            }
            placeholder={"Broj telefona"}
          ></Input>

          <Input
            leading={<AtSymbolIcon color={"white"} size={18} />}
            placeholder={"Broj telefona"}
            disabled
          ></Input>

          <StyledView className={`gap-4 flex mt-4`}>
            <Button
              size={"medium"}
              trailingIcon={<ArrowSmallRightIcon size={20} color={"#ff2222"} />}
              intent={"primary"}
            >
              What if this is long
            </Button>
            <Button size={"medium"} intent={"secondary"}>
              Tstin
            </Button>
          </StyledView>
          <StyledView
            className={`w-full flex flex-row h-11  text-accents-1 rounded-full mt-9`}
          >
            <StyledView
              className={`border-y border-l rounded-l-full  border-accents-12 flex justify-center px-4 `}
            >
              <StyledText className={`font-[figtreeMedium] text-accents-12`}>
                +387
              </StyledText>
            </StyledView>
            <StyledInput
              placeholderTextColor={"#323232"}
              placeholder={"Broj telefona"}
              keyboardType={"phone-pad"}
              className={` h-11 bg-accents-1 text-accents-12 border flex flex-grow border-accents-12 font-[figtreeMedium] px-4  rounded-r-full flex-row `}
            ></StyledInput>
          </StyledView>
        </StyledView>
      </StyledView>
    </SafeArea>
  );
};
