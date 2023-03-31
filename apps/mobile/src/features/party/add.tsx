import { z } from "zod";

import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { googleSignIn, useLoginStore } from "@lib/actions/auth";
import { checkIfUserHasData } from "@lib/actions/user";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@navigation/authStore";
import { Field, Form, FormInstance } from "houseform";
import { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Mapbox from '@rnmapbox/maps';
// import { AddressAutofill } from '@mapbox/search-js-react';
import React from "react";
import MapView, { Marker } from 'react-native-maps';
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


export interface InfoSectionForm {
  name: string;
  surname: string;
  displayname: string;
}

const phoneShema = z
  .string()
  .regex(/^[0-9]{9,15}$/, "Broj telefona nije validan");

export const PartyAdd: FC<any> = ({ navigation }) => {
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
        title={"Kreiraj party"}
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
                          className={`font-figtree-bold ${errors.length > 0
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

// Mapbox.setAccessToken('pk.eyJ1IjoianVyaWMiLCJhIjoiY2oyeWM2MmM4MDE0bzMybWtxb3dsMnN1dSJ9.TZ18h8IidnACJ6mbYeyuiA');


export const OtpSection = () => {
  const loginState = useLoginStore();
  const setAuthState = useAuthStore((s) => s.setAuthState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // const onVerify = async (values: { otp: string }) => {
  //   setIsSubmitting(true);
  //   try {
  //     // verify otp
  //     if (_DEV_USE_MAIL_LOGIN) {
  //       const { error, data } = await supabase.auth.verifyOtp({
  //         type: "magiclink",
  //         email: loginState.phone,
  //         token: values.otp,
  //       });
  //     } else {
  //       // sms otp
  //     }

  //     const userHasData = await checkIfUserHasData();
  //     if (userHasData) {
  //       // also should be set by onAuthStateChange
  //       setAuthState("SIGNED_IN");
  //     } else {
  //       setAuthState("INFO_SCREEN");
  //     }
  //   } catch (error) {
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const back = () => {
  //   loginState.setLoginState("PHONE");
  // };
  // const [value, setValue] = React.useState('');

  function mergeDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const year = d1.getUTCFullYear();
    const month = d1.getUTCMonth();
    const day = d1.getUTCDate();

    var hours = d2.getUTCHours();
    const minutes = d2.getUTCMinutes();
    const seconds = d2.getUTCSeconds();

    const timezoneOffset = d2.getTimezoneOffset();
    hours -= timezoneOffset / 60;

    const mergedDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    return mergedDate;
  }

  function onVerify(values: {
    description: string,
    location: string,
    name: string,
    start_date: number,
    start_time: number
  }, form: FormInstance<any>): void {
    console.log("Function not implemented.", values);
    // merge date and time into one
    // const date = ;
    // const time = new Date(values.start_time);
    const merged = mergeDates(values.start_time, values.start_time)
    console.log(merged);

  }

  const [coordinate, setCoordinate] = React.useState();
  const [startDate, setStartDate] = React.useState(new Date());
  const [date, setDate] = React.useState<"none" | "date" | "time">("none");


  return (
    <Section>
      <SectionTitle
        title={"Kreiraj party"}
        description={"Kreiraj party i skupi ekipu!"}
      />

      <Form<{ otp: string }> onSubmit={onVerify}>
        {({ isValid, submit }) => (
          <Div className={`flex`}>
            <Div className={`flex flex-col mb-4 grow`}>
              <Field
                name="name"
              // onBlurValidate={z.string().min(6, "Minimalno 6 znakova")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      // keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes

                      placeholder={"Naziv partyja"}
                    />
                  );
                }}
              </Field>
              <Field
                name="description"
              // onBlurValidate={z.string().min(6, "Minimalno 6 znakova")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      large
                      // keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes

                      placeholder={"Opis partyja"}
                    />
                  );
                }}
              </Field>
              <Field
                name="location"
              // onBlurValidate={z.string().min(6, "Minimalno 6 znakova")}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <Input
                      value={value}
                      // keyboardType={"phone-pad"}
                      onBlur={onBlur}
                      error={errors.join("\n")}
                      onChangeText={(text) => setValue(text)}
                      // todo toast onclick da je hr only il tak nes

                      placeholder={"Gdje je party?"}
                    />
                  );
                }}
              </Field>
              <Div className="mt-10">
                <Field
                  name="start_date"
                >
                  {({ value, setValue, onBlur, errors }) => {

                    // console.log("open", date)
                    return (
                      <>
                        <Input
                          value={value && new Date(value).toLocaleDateString()}

                          onBlur={() => {
                            console.log("blur")
                          }}
                          error={errors.join("\n")}
                          onFocus={(e) => {
                            console.log("focus")
                            setDate("date")
                            e.preventDefault()
                          }}


                          placeholder={"Datum party-a"}
                        />
                        {date == "date" && <RNDateTimePicker
                          // display="default"
                          mode="date"
                          onChange={(e) => {
                            console.log("e.nativeEvent.timestamp", e)
                            // set value to date with format DD.MM.YYYY
                            setDate("none")
                            setValue(e.nativeEvent.timestamp)
                          }}

                          value={new Date()} />}
                      </>
                    );
                  }}
                </Field>
                <Field
                  name="start_time"
                >
                  {({ value, setValue, onBlur, errors }) => {

                    // console.log("open", open)
                    return (
                      <>
                        <Input
                          value={value && new Date(value).toLocaleTimeString()}

                          onBlur={() => {
                            console.log("blur")
                          }}
                          error={errors.join("\n")}
                          onFocus={(e) => {
                            console.log("focus")
                            setDate("time")
                            e.preventDefault()
                          }}


                          placeholder={"Vrijeme party-a"}
                        />
                        {date == "time" && <RNDateTimePicker
                          // display="inline"
                          mode="time"
                          onChange={(e) => {
                            console.log("e.nativeEvent.timestamp", value)
                            setDate("none")
                            setValue(e.nativeEvent.timestamp)
                          }}
                          value={new Date()} />}
                      </>
                    );
                  }}
                </Field>
              </Div>
              <Div className=" w-full h-10">
                <Text></Text>



              </Div>
              {/* <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{
                  height: 300,
                  width: 300,
                }}>
                  {/* <MapView initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                    <Marker draggable
                      coordinate={coordinate}
                      onDragEnd={(e) => setCoordinate(e.nativeEvent.coordinate)}
                    />
                  </MapView> */}
              {/* 
            </View>
          </View> * /} */}
            </Div>

            <Div className={`flex gap-3 flex-row`}>
              <Div className={`flex basis-[33%] grow-0`}>
                <Button onPress={() => console.log("back")} size={"medium"} intent={"secondary"}>
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
        )
        }
      </Form >
    </Section >
  );
};
