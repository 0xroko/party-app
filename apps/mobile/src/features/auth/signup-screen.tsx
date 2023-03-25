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
      {loginState.state === "PHONE" && <PhoneSection />}
      {loginState.state === "OTP" && <OtpSection />}
      {loginState.state === "INFO" && <InfoSection />}
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

import { makeRedirectUri, startAsync } from "expo-auth-session";

import { supabaseUrl } from "@lib/supabase";

export const googleSignIn = async () => {
  // This will create a redirectUri
  // This should be the URL you added to "Redirect URLs" in Supabase URL Configuration
  // If they are different add the value of redirectUrl to your Supabase Redirect URLs
  const redirectUrl = makeRedirectUri({
    path: "/auth/callback",
  });
  console.log(redirectUrl);

  // authUrl: https://{YOUR_PROJECT_REFERENCE_ID}.supabase.co
  // returnURL: the redirectUrl you created above.
  const authResponse = await startAsync({
    authUrl: `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`,
    returnUrl: redirectUrl,
  });

  // If the user successfully signs in
  // we will have access to an accessToken and an refreshToken
  // and then we'll use setSession (https://supabase.com/docs/reference/javascript/auth-setsession)
  // to create a Supabase-session using these token
  if (authResponse.type === "success") {
    supabase.auth.setSession({
      access_token: authResponse.params.access_token,
      refresh_token: authResponse.params.refresh_token,
    });
  }
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
              {__DEV__ && (
                <Div className={`flex basis-[33%] grow-0`}>
                  <Button
                    onPress={async () => {
                      // const auth = await supabase.auth.signInWithOAuth({
                      //   provider: "google",
                      // });
                      const auth = await googleSignIn();
                      console.log(auth);

                      loginState.setLoginState("INFO");
                    }}
                    size={"medium"}
                    intent={"secondary"}
                  >
                    Google
                  </Button>
                </Div>
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
  const loginState = useLoginState();

  const onVerify = async (values: { otp: string }) => {
    // let res = await supabase.auth.verifyOtp({
    //   phone: "+385" + loginState.phone,
    //   token: values.otp,
    //   type: "sms",
    // });
    // TODO CHECK IF USER JUST REGISTERED FIRST TIME
    loginState.setLoginState("INFO");
    // or navigator.navigate("home")
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

interface InfoSectionForm {
  name: string;
  surname: string;
  displayName: string;
}

export const InfoSection = () => {
  const loginState = useLoginState();

  const onSubmit = async (values: InfoSectionForm) => {
    const user = await supabase.auth.getUser();
    console.log(user);
  };

  const back = () => {
    loginState.setLoginState("PHONE");
  };

  return (
    <Section>
      <SectionTitle
        title={"Još par stvari o tebi"}
        description={"Potrebno je da nam kažeš nešto o sebi"}
      />

      <Form<InfoSectionForm> onSubmit={onSubmit}>
        {({ isValid, submit }) => (
          <Div className={`flex`}>
            <Div className={`flex flex-row mb-4 grow`}>
              <Field
                name="displayName"
                onBlurValidate={z.string().superRefine((v, _ctx) => {
                  if (v.includes("@")) {
                    _ctx.addIssue({
                      code: "custom",
                      message: "Korisničko ime ne može početi sa @",
                    });
                    return z.NEVER;
                  }
                  // do this on server
                  // but also if it contains unallowed characters
                  if (v === "melon") {
                    _ctx.addIssue({
                      code: "custom",
                      message: "Korisničko ime već postoji, izaberi neko treće",
                    });
                    return z.NEVER;
                  }

                  return v;
                })}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      leading={
                        <Text
                          className={`font-figtree-bold ${
                            errors.length > 0
                              ? "text-error-primary"
                              : "text-accents-12"
                          }`}
                        >
                          @
                        </Text>
                      }
                      value={value}
                      label={"Korisničko ime"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      placeholder={"mirkom23"}
                    />
                  );
                }}
              </Field>
            </Div>

            <Div className={`flex flex-row gap-4`}>
              <Div className={`flex grow`}>
                <Field
                  name="name"
                  onBlurValidate={z
                    .string()
                    .nonempty("Ime nesmije biti prazno")
                    .superRefine((v, _ctx) => {
                      return v;
                    })}
                >
                  {({ value, setValue, onBlur, errors }) => {
                    return (
                      <Input
                        value={value}
                        label={"Ime"}
                        onBlur={onBlur}
                        error={errors.join("\n")}
                        onChangeText={(text) => setValue(text)}
                        placeholder={"Mirko"}
                      />
                    );
                  }}
                </Field>
              </Div>
              <Div className={`flex grow`}>
                <Field
                  name="surname"
                  onBlurValidate={z.string().superRefine((v, _ctx) => {
                    return v;
                  })}
                >
                  {({ value, setValue, onBlur, errors }) => {
                    return (
                      <Input
                        value={value}
                        label={"Prezime"}
                        onBlur={onBlur}
                        error={errors.join("\n")}
                        onChangeText={(text) => setValue(text)}
                        placeholder={"Mirkic"}
                      />
                    );
                  }}
                </Field>
              </Div>
            </Div>

            <Div className={`flex gap-3 flex-row mt-8`}>
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
