import { z } from "zod";

import { test } from "@party-app/themes/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form } from "houseform";
import { styled } from "nativewind";
import { FC } from "react";
import { Text, TextInput, View } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../../lib/supabase";
import { Button, Input, SafeArea } from "./signup-screen";

test;

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

const phoneShema = z
  .string()
  .regex(/^[0-9]{9,15}$/, "Broj telefona nije validan");

interface LoginState {
  phone: string;
  waitingForOtp: boolean;
  name?: string;
  surname?: string;
  displayName?: string;

  setPhone: (phone: string) => void;
  setWaitingForOtp: (waitingForOtp: boolean) => void;
  setName: (name: string) => void;
  setSurname: (surname: string) => void;
  setDisplayName: (displayName: string) => void;
}

export const useLoginState = create<LoginState>()(
  persist(
    (set) => ({
      phone: "",
      waitingForOtp: false,
      name: "",
      surname: "",
      displayName: "",
      setPhone: (phone: string) => set({ phone }),
      setWaitingForOtp: (waitingForOtp: boolean) => set({ waitingForOtp }),
      setName: (name: string) => set({ name }),
      setSurname: (surname: string) => set({ surname }),
      setDisplayName: (displayName: string) => set({ displayName }),
    }),
    {
      name: "login-state",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const LoginInfoScreen: FC<
  NativeStackScreenProps<StackNavigatorParams, "login-otp">
> = ({ navigation }) => {
  // screen width and height

  return (
    <SafeArea gradient>
      <StyledView className={`mx-[22px] flex h-full justify-evenly`}>
        <StyledView className={``}>
          <StyledText
            className={`font-figtree-bold text-accents-12 text-[36px]`}
          >
            Kreiraj račun
          </StyledText>
          <StyledText
            className={`font-figtree-medium text-accents-10 text-[18px] leading-7 mt-4`}
          >
            Koristimo brojeve kako bi lakše te spojili s prijataljima, uvijek ga
            možeš promjeniti
          </StyledText>
        </StyledView>
        <Form<{ phone: string }>
          onSubmit={async (values, _form) => {
            let res = await supabase.auth.signInWithOtp({
              phone: "+385" + values.phone,
            });

            if (res.error) {
              alert(res.error.message);
            } else {
              alert(res.data.user);
            }
          }}
        >
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
      </StyledView>
    </SafeArea>
  );
};
