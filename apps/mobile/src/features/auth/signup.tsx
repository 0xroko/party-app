import { z } from "zod";

import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { googleSignIn, useLoginStore } from "@lib/actions/auth";
import { checkIfUserHasData } from "@lib/actions/user";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@navigation/authStore";
import { Field, Form } from "houseform";
import { FC } from "react";
export interface InfoSectionForm {
  name: string;
  surname: string;
  displayname: string;
}

const phoneShema = z
  .string()
  .regex(/^[0-9]{9,15}$/, "Broj telefona nije validan");

export const LoginLoginScreen: FC<any> = ({ navigation }) => {
  const loginState = useLoginStore();

  return (
    <SafeArea gradient>
      {loginState.state === "PHONE" && <PhoneSection />}
      {loginState.state === "OTP" && <OtpSection />}
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

const _DEV_USE_MAIL_LOGIN = true;

export const PhoneSection = ({ children }: PhoneSectionProps) => {
  const loginState = useLoginStore();

  const onLoginSubmit = async (values: { phone: string }) => {
    let res;
    if (_DEV_USE_MAIL_LOGIN) {
      res = await supabase.auth.signInWithOtp({
        email: values.phone,
      });
    } else
      res = await supabase.auth.signInWithOtp({
        phone: "+385" + values.phone,
      });

    console.log(res);

    if (res.error) {
      return;
    }

    loginState.setPhone(values.phone);

    loginState.setLoginState("OTP");
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
                onBlurValidate={_DEV_USE_MAIL_LOGIN ? z.string() : phoneShema}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
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
                          {_DEV_USE_MAIL_LOGIN ? "Gmail" : "Broj telefona"}
                        </Text>
                      }
                      placeholder={
                        _DEV_USE_MAIL_LOGIN ? "Email" : "Broj telefona"
                      }
                    />
                  );
                }}
              </Field>
            </Div>

            <Div className={`flex gap-3 flex-row`}>
              {__DEV__ && (
                <>
                  <Div className={`flex basis-[15%] grow-0`}>
                    <Button
                      onPress={async () => {
                        // const auth = await supabase.auth.signInWithOAuth({
                        //   provider: "google",
                        // });
                        const auth = await googleSignIn();
                      }}
                      size={"medium"}
                      intent={"secondary"}
                    >
                      Gggl
                    </Button>
                  </Div>
                </>
              )}
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
  const loginState = useLoginStore();
  const setAuthState = useAuthStore((s) => s.setAuthState);

  const onVerify = async (values: { otp: string }) => {
    try {
      // verify otp
      if (_DEV_USE_MAIL_LOGIN) {
        const { error, data } = await supabase.auth.verifyOtp({
          type: "magiclink",
          email: loginState.phone,
          token: values.otp,
        });
      } else {
        // sms otp
      }

      const userHasData = await checkIfUserHasData();
      if (userHasData) {
        // also should be set by onAuthStateChange
        setAuthState("SIGNED_IN");
      } else {
        setAuthState("INFO_SCREEN");
      }
    } catch (error) {}
  };

  const back = () => {
    loginState.setLoginState("PHONE");
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
                  disabled={!isValid}
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
