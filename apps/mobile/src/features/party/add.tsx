import { Button } from "@components/button";
import { Div, Text } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { supabase } from "@lib/supabase";
import { Field, Form, FormInstance } from "houseform";
import { FC, useRef, useState } from "react";
// import { AddressAutofill } from '@mapbox/search-js-react';
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

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

interface PartyAddForm {
  description: string;
  location: string;
  name: string;
  start_date: number;
  start_time: number;
}

export const PartyAdd: FC<
  NativeStackScreenProps<StackNavigatorParams, "home">
> = ({ navigation, route }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function mergeDates(date1, date2): Date {
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

    const mergedDate = new Date(
      Date.UTC(year, month, day, hours, minutes, seconds)
    );

    return mergedDate;
  }

  const idRef = useRef<any>();

  async function onVerify(values: PartyAddForm, form: FormInstance<any>) {
    console.log("Function not implemented.", values);

    // merge date and time into one
    // const date = ;
    // const time = new Date(values.start_time);
    const merged = mergeDates(values.start_time, values.start_time);
    const { data, error } = await supabase.auth.getUser();
    const res = await supabase
      .from("Party")
      .insert([
        {
          name: values.name,
          description: values.description,
          location: values.location,
          time_starting: merged.toISOString(),
          hostId: data.user.id,
        },
      ])
      .select("*");
    idRef.current = res.data[0].id;
    console.log(res);
  }

  const [coordinate, setCoordinate] = React.useState();
  const [startDate, setStartDate] = React.useState(new Date());
  const [date, setDate] = React.useState<"none" | "date" | "time">("none");

  return (
    <SafeArea>
      <Section>
        <SectionTitle
          title={"Kreiraj party"}
          description={"Kreiraj party i skupi ekipu!"}
        />

        <Form<PartyAddForm> onSubmit={onVerify}>
          {({ isValid, submit }) => (
            <Div className={`flex`}>
              <Div className={`flex flex-col mb-4 grow g-4`}>
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
                        label={"Naziv partyja"}
                        placeholder={"Party kod doma"}
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
                        label="Opis partyja"
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
                        label={"Lokacija"}
                        placeholder={"Gdje je party?"}
                      />
                    );
                  }}
                </Field>
                <Div className="">
                  <Div className={`flex flex-row g-4`}>
                    <Div className={`flex-1`}>
                      <Field name="start_date">
                        {({ value, setValue, onBlur, errors }) => {
                          // console.log("open", date)
                          return (
                            <>
                              <Input
                                value={
                                  value && new Date(value).toLocaleDateString()
                                }
                                onBlur={() => {
                                  console.log("blur");
                                }}
                                label={"Datum"}
                                error={errors.join("\n")}
                                onFocus={(e) => {
                                  console.log("focus");
                                  setDate("date");
                                  e.preventDefault();
                                }}
                                placeholder={"Datum party-a"}
                              />
                              {date == "date" && (
                                <RNDateTimePicker
                                  // display="default"
                                  mode="date"
                                  onChange={(e) => {
                                    console.log("e.nativeEvent.timestamp", e);
                                    // set value to date with format DD.MM.YYYY
                                    setDate("none");
                                    setValue(e.nativeEvent.timestamp);
                                  }}
                                  value={new Date()}
                                />
                              )}
                            </>
                          );
                        }}
                      </Field>
                    </Div>
                    <Div className={`flex-1`}>
                      <Field name="start_time">
                        {({ value, setValue, onBlur, errors }) => {
                          // console.log("open", open)
                          return (
                            <>
                              <Input
                                value={
                                  value && new Date(value).toLocaleTimeString()
                                }
                                onBlur={() => {
                                  console.log("blur");
                                }}
                                error={errors.join("\n")}
                                label={"Vrijeme"}
                                onFocus={(e) => {
                                  console.log("focus");
                                  setDate("time");
                                  e.preventDefault();
                                }}
                                placeholder={"Vrijeme party-a"}
                              />
                              {date == "time" && (
                                <RNDateTimePicker
                                  // display="inline"
                                  mode="time"
                                  onChange={(e) => {
                                    console.log(
                                      "e.nativeEvent.timestamp",
                                      value
                                    );
                                    setDate("none");
                                    setValue(e.nativeEvent.timestamp);
                                  }}
                                  value={new Date()}
                                />
                              )}
                            </>
                          );
                        }}
                      </Field>
                    </Div>
                  </Div>
                </Div>
              </Div>

              <Div className={`flex gap-3 flex-row mt-6`}>
                <Div className={`flex basis-[33%] grow-0`}>
                  <Button
                    onPress={() => navigation.navigate("home")}
                    size={"medium"}
                    intent={"secondary"}
                  >
                    Natrag
                  </Button>
                </Div>
                <Div className={`flex grow`}>
                  <Button
                    size={"medium"}
                    disabled={!isValid || isSubmitting}
                    onPress={async () => {
                      await submit();
                      navigation.navigate("party-add-more", {
                        id: idRef.current,
                      });
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
    </SafeArea>
  );
};
