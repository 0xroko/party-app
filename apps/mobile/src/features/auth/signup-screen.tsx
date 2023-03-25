import { z } from "zod";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form } from "houseform";
import { styled } from "nativewind";
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
import { supabase } from "../../lib/supabase";
import { useLoginState } from "./signup-otp";
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

interface SafeAreaProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  gradient?: boolean;
}

export const SafeArea = ({ children, className, gradient }: SafeAreaProps) => {
  const d = useWindowDimensions();

  return (
    <StyledView
      className={`flex flex-col justify-between  h-full bg-accents-1 text-accents-12`}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />
      {gradient && (
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
      )}

      <StyledView className={`${className} pt-[30]`}>{children}</StyledView>
    </StyledView>
  );
};

import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "w-full justify-center items-center rounded-full flex-row",
  {
    variants: {
      intent: {
        primary: "bg-accents-12 text-accents-1 hover:bg-accents-11",
        secondary: "bg-accents-1 text-accents-12 border border-accents-12",
      },
      size: {
        medium: "text-base h-10",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);

const buttonTextStyles = cva("", {
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
    <TouchableOpacity activeOpacity={0.9} {...o}>
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
    const inputStyles = cva(
      "h-10 bg-accents-1 border flex flex-grow font-figtree-medium px-4 rounded-r-full flex-row",
      {
        variants: {
          leading: {
            false: "border-l rounded-l-full",
          },
          state: {
            error: "border-error-primary text-error-primary",
            disabled: "border-accents-4 text-accents-4",
            default: "border-accents-12 text-accents-12",
          },
        },
      }
    );

    const leadingStyles = cva(
      "border-y border-l rounded-l-full flex justify-center px-4 ",
      {
        variants: {
          state: {
            error: "border-error-primary text-error-primary",
            disabled: "border-accents-4 text-accents-4",
            default: "border-accents-12 text-accents-12 ",
          },
        },
      }
    );

    // TODO: napp colors package jer nativewind ne radi s rel importima u tailwind.conf
    const placeHolderStyles = cva("", {
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
      <StyledView className={`w-full`}>
        <StyledView
          className={`w-full flex flex-row h-10 text-accents-1 rounded-full mt-9`}
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

  const loginState = useLoginState();

  return (
    <SafeArea gradient>
      <PhoneSection />
    </SafeArea>
  );
};

/*
      { <Svg width="398" height="427" viewBox="0 0 398 427" fill="none">
        <g opacity="0.45">
          <rect
            x="-12.7754"
            y="-12"
            width="429.447"
            height="439"
            rx="5"
            fill="url(#paint0_linear_417_1027)"
          />
          <rect
            x="-12.7754"
            y="-12"
            width="429.447"
            height="439"
            rx="5"
            fill="url(#paint1_radial_417_1027)"
          />
          <rect
            x="-12.7754"
            y="-12"
            width="429.447"
            height="439"
            rx="5"
            fill="url(#paint2_radial_417_1027)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_417_1027"
            x1="201.948"
            y1="-12"
            x2="201.948"
            y2="427"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#430086" stop-opacity="0" />
            <stop offset="1" stop-color="#430086" />
          </linearGradient>
          <radialGradient
            id="paint1_radial_417_1027"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(201.948 207.5) rotate(45.6302) scale(307.061 306.987)"
          >
            <stop stop-color="#FFA0FF" stop-opacity="0.2" />
            <stop offset="0.5" stop-color="#FFA0FF" stop-opacity="0" />
          </radialGradient>
          <radialGradient
            id="paint2_radial_417_1027"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(201.948 207.5) rotate(45.6302) scale(307.061 306.987)"
          >
            <stop stop-color="#FFA0FF" stop-opacity="0.1" />
            <stop offset="0.64" stop-color="#FFA0FF" stop-opacity="0" />
          </radialGradient>
        </defs>
      </Svg> }
*/

interface SectionProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Section = ({ children }: SectionProps) => {
  return (
    <StyledView className={`mx-[22px] flex h-full justify-evenly`}>
      {children}
    </StyledView>
  );
};

interface SectionTitleProps {
  title: string;
  description: string;
}

export const SectionTitle = ({ description, title }: SectionTitleProps) => {
  return (
    <StyledView className={``}>
      <StyledText className={`font-figtree-bold text-accents-12 text-[36px]`}>
        {title}
      </StyledText>
      <StyledText
        className={`font-figtree-medium text-accents-10 text-[18px] leading-7 mt-4`}
      >
        {description}
      </StyledText>
    </StyledView>
  );
};

interface PhoneSectionProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PhoneSection = ({ children }: PhoneSectionProps) => {
  const loginState = useLoginState();

  const onLoginSubmit = async (values: { phone: string }) => {
    let res = await supabase.auth.signInWithOtp({
      phone: "+385" + values.phone,
    });

    if (res.error) {
      console.log(res.error);
      return;
    }

    loginState.setPhone(values.phone);
    loginState.setWaitingForOtp(true);
  };

  return (
    <Section>
      <SectionTitle
        title={"Kreiraj račun"}
        description={
          "Koristimo brojeve kako bi lakše te spojili s prijateljima, uvijek ga možeš promjeniti"
        }
      />

      <Form<{ phone: string }> onSubmit={onLoginSubmit}>
        {({ isValid, submit }) => (
          <StyledView className={`flex`}>
            <StyledView className={`flex flex-row mb-4 grow`}>
              <Field name="phone" onBlurValidate={phoneShema}>
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes
                      leading={
                        <StyledText
                          className={`font-figtree-bold ${
                            errors.length > 0
                              ? "text-error-primary"
                              : "text-accents-12"
                          }`}
                        >
                          +385
                        </StyledText>
                      }
                      placeholder={"Broj telefona"}
                    />
                  );
                }}
              </Field>
            </StyledView>

            <StyledView className={`flex gap-3 flex-row`}>
              {/* <StyledView className={`flex basis-[33%] grow-0`}>
              <Button size={"medium"} intent={"secondary"}>
                Natrag
              </Button>
            </StyledView> */}
              <StyledView className={`flex grow`}>
                <Button
                  size={"medium"}
                  onPress={() => {
                    submit();
                  }}
                  intent={"primary"}
                >
                  Dalje
                </Button>
              </StyledView>
            </StyledView>
          </StyledView>
        )}
      </Form>
    </Section>
  );
};

export const OtpSection = () => {
  const loginState = useLoginState();

  const onVerify = async (values: { otp: string }) => {
    let res = await supabase.auth.verifyOtp({
      phone: "+385" + loginState.phone,
      token: values.otp,
      type: "sms",
    });
  };

  return (
    <Section>
      <SectionTitle
        title={"Kreiraj račun"}
        description={
          "Koristimo brojeve kako bi lakše te spojili s prijateljima, uvijek ga možeš promjeniti"
        }
      />

      <Form<{ otp: string }> onSubmit={onVerify}>
        {({ isValid, submit }) => (
          <StyledView className={`flex`}>
            <StyledView className={`flex flex-row mb-4 grow`}>
              <Field name="phone" onBlurValidate={phoneShema}>
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes
                      leading={
                        <StyledText
                          className={`font-figtree-bold ${
                            errors.length > 0
                              ? "text-error-primary"
                              : "text-accents-12"
                          }`}
                        >
                          +385
                        </StyledText>
                      }
                      placeholder={"Broj telefona"}
                    />
                  );
                }}
              </Field>
            </StyledView>

            <StyledView className={`flex gap-3 flex-row`}>
              {/* <StyledView className={`flex basis-[33%] grow-0`}>
              <Button size={"medium"} intent={"secondary"}>
                Natrag
              </Button>
            </StyledView> */}
              <StyledView className={`flex grow`}>
                <Button
                  size={"medium"}
                  onPress={() => {
                    submit();
                  }}
                  intent={"primary"}
                >
                  Dalje
                </Button>
              </StyledView>
            </StyledView>
          </StyledView>
        )}
      </Form>
    </Section>
  );
};
