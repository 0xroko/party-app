import { SafeArea } from "@components/safe-area";

import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";
import { NavBar } from "@components/navbar";
import { displayNameSchema } from "@features/auth/info-screen";
import { useAuthUser } from "@hooks/useAuthUser";
import { useUser } from "@hooks/useUser";
import { User } from "@lib/actions";
import { updateUser } from "@lib/actions/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form, FormInstance } from "houseform";
import { FC, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import { queryClient } from "../../provider";

type UserEditForm = Pick<
  User,
  "bio" | "displayname" | "name" | "surname" | "age" | "location"
>;

export const UserEditScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "user-edit">
> = ({ navigation, route }) => {
  // screen width and height

  const { data: authUser, isFetched, refetch } = useAuthUser();
  const { data: user, isLoading } = useUser(authUser?.user?.id);

  const useMutateUser = useMutation({
    mutationFn: (data: UserEditForm) => {
      return Promise.all([
        updateUser(data, authUser.user),
        new Promise((resolve) => setTimeout(resolve, 200)),
      ])[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", authUser.user.id] });
    },
    onError: (err) => {},
  });
  const onSubmit = async (data: UserEditForm) => {
    try {
      await useMutateUser.mutateAsync(data);

      // ko apple delay da se "nes radi"

      navigation.goBack();
    } catch (error) {}
  };

  const formRef = useRef<FormInstance<UserEditForm>>(null);

  const isSetRef = useRef(false);

  useEffect(() => {
    if (user && !isSetRef.current) {
      // da..... houseform je jos nov dost
      // @ts-ignore
      formRef.current?.getFieldValue("displayname").setValue(user.displayname);
      // @ts-ignore
      formRef.current?.getFieldValue("name").setValue(user.name);
      // @ts-ignore
      formRef.current?.getFieldValue("surname").setValue(user.surname);
      // @ts-ignore
      formRef.current?.getFieldValue("bio").setValue(user.bio);
      // @ts-ignore
      formRef.current?.getFieldValue("age").setValue(user.age.toString());
      // @ts-ignore
      formRef.current?.getFieldValue("location").setValue(user.location);

      isSetRef.current = true;
    }
  }, [user]);

  const [currentName, setCurrentName] = useState<string>(user?.displayname);

  const oldName = currentName === user?.displayname;

  return (
    <SafeArea gradient>
      <NavBar />
      <SafeArea.Content>
        <Text
          className={`text-3xl tracking-tight font-figtree-bold text-accents-12 mb-8 mt-6`}
        >
          Uredi profil
        </Text>
        <Div>
          <Form<UserEditForm> ref={formRef} onSubmit={onSubmit}>
            {({ isValid, submit, isTouched }) => (
              <Div className={`flex`}>
                <Div className={`flex flex-row mb-4 grow`}>
                  <Field
                    onChangeValidate={displayNameSchema(user?.id)}
                    name="displayname"
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
                              setCurrentName(text);
                              setValue(text);
                            }}
                            placeholder={"mirkom23"}
                          />
                          {isValid && !isValidating && isDirty ? (
                            <Text className={`text-success-primary mt-2`}>
                              {oldName ? (
                                <>Trenutno ime</>
                              ) : (
                                <>
                                  Ime{" "}
                                  <Text className={`font-figtree-bold`}>
                                    {value}
                                  </Text>{" "}
                                  je slobodno!
                                </>
                              )}
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
                            label={"Ime"}
                            onBlur={onBlur}
                            error={errors.join("\n")}
                            onChangeText={(text) => {
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
                            label={"Prezime"}
                            onBlur={onBlur}
                            error={errors.join("\n")}
                            onChangeText={(text) => {
                              setValue(text);
                            }}
                            placeholder={"Mirkic"}
                          />
                        );
                      }}
                    </Field>
                  </Div>
                </Div>

                <Div className={`flex flex-row mt-4`}>
                  <Field
                    name="bio"
                    onBlurValidate={z.string()}
                    onChangeValidate={z
                      .string()
                      .max(100, "Maksimalno 100 znakova!")}
                  >
                    {({ value, setValue, onBlur, errors, validate }) => {
                      return (
                        <Input
                          value={value}
                          label={"Bio"}
                          onBlur={onBlur}
                          numberOfLines={4}
                          large
                          error={errors.join("\n")}
                          onChangeText={(text) => {
                            validate("onChangeValidate");
                            setValue(text);
                          }}
                        />
                      );
                    }}
                  </Field>
                </Div>

                <Div className={`flex flex-row mt-4`}>
                  <Div className={`flex basis-[40%] grow`}>
                    <Field
                      name="age"
                      onBlurValidate={z.coerce
                        .number()
                        .min(16, "Moraš biti stariji od 16!")
                        .max(100, "Moraš biti mlađi od 100!")}
                    >
                      {({ value, setValue, onBlur, errors }) => {
                        return (
                          <Input
                            value={value}
                            keyboardType={"number-pad"}
                            label={"Godine"}
                            onBlur={onBlur}
                            error={errors.join("\n")}
                            onChangeText={(text) => {
                              setValue(text);
                            }}
                            placeholder={"23"}
                          />
                        );
                      }}
                    </Field>
                  </Div>
                  <Div className={`h-1 flex basis-[20px] grow-0`} />
                  <Div className={`flex basis-[40%] grow`}>
                    <Field
                      name="location"
                      onBlurValidate={z.string().max(23, "Max 23 znakova!")}
                    >
                      {({ value, setValue, onBlur, errors }) => {
                        return (
                          <Input
                            value={value}
                            label={"Grad/Lokacija"}
                            onBlur={onBlur}
                            error={errors.join("\n")}
                            onChangeText={(text) => {
                              setValue(text);
                            }}
                            placeholder={"Zagreb"}
                          />
                        );
                      }}
                    </Field>
                  </Div>
                </Div>

                <Div className={`flex gap-3 flex-row mt-8`}>
                  <Div className={`flex grow`}>
                    <Button
                      size={"medium"}
                      disabled={
                        !isValid || useMutateUser.isLoading || !isTouched
                      }
                      onPress={() => {
                        submit();
                      }}
                      intent={"primary"}
                    >
                      Spremi
                    </Button>
                  </Div>
                </Div>
              </Div>
            )}
          </Form>
        </Div>
      </SafeArea.Content>
    </SafeArea>
  );
};
