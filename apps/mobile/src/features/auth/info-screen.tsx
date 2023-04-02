import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";

import { SafeArea } from "@components/safe-area";
import { InfoSectionForm, Section, SectionTitle } from "@features/auth/signup";
import { logOut, useLoginStore } from "@lib/actions/auth";
import { checkIfDisplayNameExists, createUser } from "@lib/actions/user";
import { useAuthStore } from "@navigation/authStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form } from "houseform";
import { FC } from "react";
import { z } from "zod";

export const lowerCaseSchema = z.string().superRefine((v, _ctx) => {
  if (v.toLowerCase() !== v) {
    _ctx.addIssue({
      code: "custom",
      message: "Samo mala slova su dozvoljena",
    });
    return z.NEVER;
  }
});

export const displayNameSchema = (ignoreId?: string) =>
  z
    .string()
    .toLowerCase()
    .max(20, "Maksimalno 20 znakova!")
    .superRefine(async (v, _ctx) => {
      if (!v || v.length === 0) {
        _ctx.addIssue({
          code: "custom",
          message: "Obavezno!",
        });
        return z.NEVER;
      }

      if (v.includes("@")) {
        _ctx.addIssue({
          code: "custom",
          message: "Korisničko ime ne može početi sa @",
        });
        return z.NEVER;
      }

      const exists = await checkIfDisplayNameExists(v, ignoreId);
      if (exists) {
        _ctx.addIssue({
          code: "custom",
          message: "Korisničko ime već postoji, izaberi neko treće",
        });
        return z.NEVER;
      }

      // do this on server
      // but also if it contains unallowed characters

      return v;
    });

export const InfoSection = () => {
  const loginState = useLoginStore();

  const setAuthState = useAuthStore((s) => s.setAuthState);

  const onSubmit = async (values: InfoSectionForm) => {
    const user = await createUser(values);
    if (user) {
      setAuthState("SIGNED_IN");
    }
  };

  const back = () => {
    logOut(false);
    loginState.setLoginState("PHONE");
  };

  return (
    <Section>
      <SectionTitle
        title={"Još par stvari o tebi"}
        description={"Potrebno je da nam kažeš nešto o sebi"}
      />

      <Form<InfoSectionForm> onSubmit={onSubmit}>
        {({ isValid, submit, isSubmitted }) => (
          <Div className={`flex`}>
            <Div className={`flex flex-row grow mb-3`}>
              <Field
                initialValue={loginState.infoSectionFormData?.displayname}
                name="displayname"
                onChangeValidate={displayNameSchema()}
                onMountValidate={
                  loginState.infoSectionFormData?.displayname
                    ? displayNameSchema()
                    : undefined
                }
              >
                {({
                  value,
                  setValue,
                  onBlur,
                  errors,
                  isValid,
                  isValidating,
                  isDirty,
                }) => {
                  return (
                    <Div className={`w-full`}>
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
                        autoCapitalize={"none"}
                        onChangeText={(text) => {
                          loginState.setInfoSectionFormData({
                            displayname: text,
                          });
                          setValue(text);
                        }}
                        placeholder={"mirkom23"}
                      />
                      {isValid && !isValidating && isDirty ? (
                        <Text className={`text-success-primary mt-2`}>
                          Ime{" "}
                          <Text className={`font-figtree-bold`}>{value}</Text>{" "}
                          je slobodno!
                        </Text>
                      ) : errors.length > 0 ? (
                        <></>
                      ) : (
                        <Text className={`text-error-primary mt-2`}> </Text>
                      )}
                    </Div>
                  );
                }}
              </Field>
            </Div>

            <Div className={`flex flex-row`}>
              <Div className={`flex basis-[40%] grow`}>
                <Field
                  name="name"
                  initialValue={loginState.infoSectionFormData?.name}
                  onBlurValidate={z
                    .string()
                    .nonempty("Obavezno!")
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
                        onChangeText={(text) => {
                          loginState.setInfoSectionFormData({ name: text });
                          setValue(text);
                        }}
                        placeholder={"Mirko"}
                      />
                    );
                  }}
                </Field>
              </Div>
              <Div className={`h-1 flex basis-[20px] grow-0`} />
              <Div className={`flex basis-[40%] grow`}>
                <Field
                  name="surname"
                  initialValue={loginState.infoSectionFormData?.surname}
                  onBlurValidate={z
                    .string()
                    .nonempty("Obavezno!")
                    .max(20, "Maksimalno 20 znakova!")
                    .superRefine((v, _ctx) => {
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
                        onChangeText={(text) => {
                          loginState.setInfoSectionFormData({ surname: text });
                          setValue(text);
                        }}
                        placeholder={"Mirkic"}
                      />
                    );
                  }}
                </Field>
              </Div>
            </Div>

            <Div className={`flex g-3 flex-row mt-12`}>
              <Div className={`flex basis-[33%] grow-0`}>
                <Button onPress={back} size={"medium"} intent={"secondary"}>
                  Natrag
                </Button>
              </Div>
              <Div className={`flex grow`}>
                <Button
                  size={"medium"}
                  disabled={!isValid || isSubmitted}
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

export const UserLoginInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "login-info">
> = ({ navigation, route }) => {
  // screen width and height

  return (
    <SafeArea gradient>
      <Div className={`mx-[22px] flex h-full justify-evenly`}>
        <InfoSection />
      </Div>
    </SafeArea>
  );
};
