import { z } from "zod";

import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form } from "houseform";
import { FC } from "react";
import { useLoginState } from "./signup-otp";

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
      {loginState.waitingForOtp ? <OtpSection /> : <PhoneSection />}
    </SafeArea>
  );
};

interface SectionProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Section = ({ children }: SectionProps) => {
  return (
    <Div className={`mx-[22px] flex h-full justify-evenly`}>{children}</Div>
  );
};

interface SectionTitleProps {
  title: string;
  description: string;
}

export const SectionTitle = ({ description, title }: SectionTitleProps) => {
  return (
    <Div className={``}>
      <Text className={`font-figtree-bold text-accents-12 text-[36px]`}>
        {title}
      </Text>
      <Text
        className={`font-figtree-medium text-accents-10 text-[18px] leading-7 mt-4`}
      >
        {description}
      </Text>
    </Div>
  );
};

interface PhoneSectionProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const PhoneSection = ({ children }: PhoneSectionProps) => {
  const loginState = useLoginState();

  const onLoginSubmit = async (values: { phone: string }) => {
    // let res = await supabase.auth.signInWithOtp({
    //   phone: "+385" + values.phone,
    // });

    // if (res.error) {
    //   console.log(res.error);
    //   return;
    // }

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
          <Div className={`flex`}>
            <Div className={`flex flex-row mb-4 grow`}>
              <Field
                name="phone"
                initialValue={loginState.phone}
                onBlurValidate={phoneShema}
              >
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
                        <Text
                          className={`font-figtree-bold ${
                            errors.length > 0
                              ? "text-error-primary"
                              : "text-accents-12"
                          }`}
                        >
                          +385
                        </Text>
                      }
                      placeholder={"Broj telefona"}
                    />
                  );
                }}
              </Field>
            </Div>

            <Div className={`flex gap-3 flex-row`}>
              {/* <Div className={`flex basis-[33%] grow-0`}>
              <Button size={"medium"} intent={"secondary"}>
                Natrag
              </Button>
            </Div> */}
              <Div className={`flex grow`}>
                <Button
                  size={"medium"}
                  onPress={() => {
                    submit();
                  }}
                  intent={"primary"}
                >
                  Dalje
                </Button>
              </Div>
            </Div>
          </Div>
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

  const back = () => {
    loginState.setWaitingForOtp(false);
  };

  return (
    <Section>
      <SectionTitle
        title={"Potvrdi broj"}
        description={"Poslali smo ti SMS poruku s verifikacijskim kodom"}
      />

      <Form<{ otp: string }> onSubmit={onVerify}>
        {({ isValid, submit }) => (
          <Div className={`flex`}>
            <Div className={`flex flex-row mb-4 grow`}>
              <Field
                name="otp"
                onBlurValidate={z.string().min(6, "Minimalno 6 znakova")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes

                      placeholder={"6 znamenkasti kod"}
                    />
                  );
                }}
              </Field>
            </Div>

            <Div className={`flex gap-3 flex-row`}>
              <Div className={`flex basis-[33%] grow-0`}>
                <Button onPress={back} size={"medium"} intent={"secondary"}>
                  Natrag
                </Button>
              </Div>
              <Div className={`flex grow`}>
                <Button
                  size={"medium"}
                  onPress={() => {
                    submit();
                  }}
                  intent={"primary"}
                >
                  Dalje
                </Button>
              </Div>
            </Div>
          </Div>
        )}
      </Form>
    </Section>
  );
};
