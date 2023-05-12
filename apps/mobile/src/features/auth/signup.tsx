import { z } from "zod";

import { Button } from "@components/button";
import { CoverTextShadowStyle, Div, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { googleSignIn, useLoginStore } from "@lib/actions/auth";
import { checkIfUserHasData } from "@lib/actions/user";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@navigation/authStore";
import { Field, Form, FormInstance } from "houseform";
import { FC, useRef, useState } from "react";
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
      <SafeArea.Content>
        {loginState.state === "PHONE" && <PhoneSection />}
        {loginState.state === "OTP" && <OtpSection />}
      </SafeArea.Content>
    </SafeArea>
  );
};

interface SectionProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const Section = ({ children, className }: SectionProps) => {
  return (
    <Div className={`flex h-full justify-evenly ${className}`}>{children}</Div>
  );
};

interface SectionTitleProps {
  title: string;
  description: string;
  textShadow?: boolean;
  className?: string;
}

export const SectionTitle = ({
  description,
  title,
  textShadow,
  className,
}: SectionTitleProps) => {
  const textShadowStyle = textShadow ? CoverTextShadowStyle : {};
  return (
    <Div className={className}>
      <Text
        style={textShadowStyle}
        className={`font-figtree-bold text-accents-12 text-[36px]`}
      >
        {title}
      </Text>
      <Text
        style={textShadowStyle}
        className={`font-figtree-medium text-accents-11 text-[18px] leading-7 mt-4`}
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onLoginSubmit = async (
    values: { phone: string },
    form: FormInstance<{ phone: string }>
  ) => {
    console.log(form);
    setIsSubmitting(true);
    let res;
    if (_DEV_USE_MAIL_LOGIN) {
      res = await supabase.auth.signInWithOtp({
        email: values.phone,
      });
    } else
      res = await supabase.auth.signInWithOtp({
        phone: "+385" + values.phone,
      });

    if (res.error) {
      form.getFieldValue("phone").setErrors([res.error.message]);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    loginState.setPhone(values.phone);

    loginState.setLoginState("OTP");
  };

  return (
    <Section>
      <SectionTitle
        title={"Kreiraj račun"}
        description={`Koristimo ${
          !_DEV_USE_MAIL_LOGIN ? "brojeve" : "email"
        } kako bi lakše te spojili s prijateljima${
          !_DEV_USE_MAIL_LOGIN ? ", uvijek ga možeš promjeniti" : ""
        }`}
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
                {({ value, setValue, onBlur, errors, validate }) => {
                  return (
                    <Input
                      value={value}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => {
                        setValue(text);
                        validate("onBlurValidate");
                      }}
                      // todo toast onclick da je hr only il tak nes
                      leading={
                        <Text
                          className={`font-figtree-bold ${
                            errors.length > 0
                              ? "text-error-primary"
                              : "text-accents-12"
                          }`}
                        >
                          {_DEV_USE_MAIL_LOGIN ? "Email" : "Broj telefona"}
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
              {false && (
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
                  disabled={!isValid || isSubmitting}
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<FormInstance<{ otp: string }>>(null);

  const onVerify = async (values: { otp: string }) => {
    setIsSubmitting(true);
    try {
      // verify otp
      if (_DEV_USE_MAIL_LOGIN) {
        const { error, data } = await supabase.auth.verifyOtp({
          type: "magiclink",
          email: loginState.phone,
          token: values.otp,
        });

        if (error) {
          formRef.current
            ?.getFieldValue("otp")
            .setErrors(["Kod nije valjan ili je istekao"]);
          setIsSubmitting(false);
          return;
        }
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
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const back = () => {
    loginState.setLoginState("PHONE");
  };

  return (
    <Section>
      <SectionTitle
        title={`Potvrdi ${_DEV_USE_MAIL_LOGIN ? "email" : "broj telefona"}`}
        description={`Poslali smo ti ${
          _DEV_USE_MAIL_LOGIN ? "email" : "SMS poruku"
        } s verifikacijskim kodom`}
      />

      <Form<{ otp: string }> ref={formRef} onSubmit={onVerify}>
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
                  disabled={!isValid || isSubmitting}
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
