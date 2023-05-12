import { Button } from "@components/button";
import { CoverTextShadowStyle, Div, T } from "@components/index";
import { Input } from "@components/input";
import { SafeArea } from "@components/safe-area";
import { supabase } from "@lib/supabase";
import { Field, Form, FormInstance } from "houseform";
import { FC, useEffect, useRef } from "react";
// import { AddressAutofill } from '@mapbox/search-js-react';
import { actionSheetRef } from "@components/action-sheet";
import { AddDialog, TagContainer, useTagsStore } from "@components/party-tags";
import { PartyCover, useParty } from "@features/party/id";
import { onSupabaseError } from "@lib/actions";
import { queryKeys } from "@lib/const";
import { partyDateFormat, partyTimeFormat } from "@lib/misc";
import { queryClient } from "@lib/queryCache";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, ScrollView } from "react-native";
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
interface PartyAddForm {
  description: string;
  location: string;
  name: string;
  start_date: number;
  start_time: number;
}

export const PartyAdd: FC<
  NativeStackScreenProps<StackNavigatorParams, "party-add">
> = ({ navigation, route }) => {
  const edit = route.params?.id ? true : false;

  const idRef = useRef<any>();
  const formRef = useRef<FormInstance<PartyAddForm>>(null);
  const { data: partyData, error: partyError } = useParty(route.params?.id);
  const [initialWasSet, setInitialWasSet] = React.useState(false);
  const { setInitial, tags, setDialogVisible, reset } = useTagsStore();

  useEffect(() => {
    if (edit) {
      reset();
    }
  }, []);

  useEffect(() => {
    setInitial(partyData?.tags ?? []);
    if (edit && partyData && !initialWasSet) {
      const date = new Date(partyData.time_starting);
      const time = new Date(partyData.time_starting);
      // date.setHours(0, 0, 0, 0);
      // time.setFullYear(0, 0, 0);
      // @ts-ignore
      formRef?.current?.getFieldValue("name")?.setValue(partyData?.name);
      // @ts-ignore
      formRef?.current
        ?.getFieldValue("description")
        // @ts-ignore
        ?.setValue(partyData?.description);
      // @ts-ignore
      formRef?.current
        ?.getFieldValue("location")
        // @ts-ignore

        ?.setValue(partyData?.location);
      // @ts-ignore

      formRef?.current?.getFieldValue("start_date")?.setValue(date);
      // @ts-ignore
      formRef?.current?.getFieldValue("start_time")?.setValue(time);

      setInitialWasSet(true);
    }
  }, [partyData]);

  async function onCreate(values: PartyAddForm, form: FormInstance<any>) {
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

    if (res.error) {
      onSupabaseError(res.error);
    }

    navigation.navigate("party-add-more", { id: res.data[0].id });
  }

  const onUpdate = async (values: PartyAddForm, form: FormInstance<any>) => {
    const merged = mergeDates(values.start_time, values.start_time);

    console.log(merged.toLocaleString());

    const { data, error } = await supabase.auth.getUser();
    const res = await supabase
      .from("Party")
      .update({
        name: values.name,
        description: values.description,
        location: values.location,
        time_starting: merged.toISOString(),
        hostId: data.user.id,
        tags: tags,
      })
      .eq("id", route.params?.id)
      .select("*");

    queryClient.invalidateQueries(queryKeys.partyId(route.params?.id));

    if (res.error) {
      onSupabaseError(res.error);
    } else {
      navigation.goBack();
    }
  };

  const [date, setDate] = React.useState<"none" | "date" | "time">("none");

  return (
    <>
      <AddDialog />
      <SafeArea gradient={!edit} midGradient={!edit}>
        {edit && partyData?.imageUrl && (
          <PartyCover imgUri={partyData?.imageUrl} />
        )}
        <Div className={`flex-1`}>
          <ScrollView
            contentContainerStyle={{
              marginHorizontal: 18,
              paddingBottom: 40,
            }}
          >
            <Div className={`h-[340px] flex justify-center`}>
              <T
                style={CoverTextShadowStyle}
                className={`font-figtree-bold text-accents-12 text-[36px]`}
              >
                {edit ? "Uredi party" : "Kreiraj party"}
              </T>
              <T
                style={CoverTextShadowStyle}
                className={`font-figtree-medium text-accents-11 text-[18px] leading-7 mt-4`}
              >
                {edit
                  ? "Promjeni detalje kad god želiš"
                  : "Kreiraj party i skupi ekipu!"}
              </T>
            </Div>

            <Form<PartyAddForm>
              ref={formRef}
              onSubmit={edit ? onUpdate : onCreate}
            >
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
                                  <Pressable onPress={() => setDate("date")}>
                                    <Input
                                      value={partyDateFormat(value)}
                                      onBlur={() => {
                                        console.log("blur");
                                      }}
                                      editable={false}
                                      label={"Datum"}
                                      error={errors.join("\n")}
                                      onFocus={(e) => {
                                        console.log("focus");
                                        setDate("date");
                                        e.preventDefault();
                                      }}
                                      placeholder={"Datum party-a"}
                                    />
                                  </Pressable>
                                  {date == "date" && (
                                    <RNDateTimePicker
                                      // display="default"
                                      mode="date"
                                      onChange={(e) => {
                                        setDate("none");
                                        if (e.type == "dismissed") return;
                                        setValue(e.nativeEvent.timestamp);
                                      }}
                                      value={value || new Date()}
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
                                  <Pressable
                                    onPress={(e) => {
                                      setDate("time");
                                    }}
                                  >
                                    <Input
                                      value={partyTimeFormat(value)}
                                      onBlur={() => {
                                        console.log("blur");
                                      }}
                                      editable={false}
                                      error={errors.join("\n")}
                                      label={"Vrijeme"}
                                      placeholder={"Vrijeme party-a"}
                                    />
                                  </Pressable>
                                  {date == "time" && (
                                    <RNDateTimePicker
                                      // display="inline"
                                      mode="time"
                                      onChange={(e) => {
                                        setDate("none");

                                        if (e.type === "dismissed") return;
                                        setValue(e.nativeEvent.timestamp);
                                      }}
                                      value={value || new Date()}
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

                  {edit && <TagContainer />}

                  <Div className={`flex gap-3 flex-row mt-6`}>
                    <Div className={`flex basis-[33%] grow-0`}>
                      <Button
                        onPress={() => {
                          if (edit) {
                            navigation.pop();
                          } else {
                            navigation.navigate("home");
                          }
                        }}
                        size={"medium"}
                        intent={"secondary"}
                      >
                        Natrag
                      </Button>
                    </Div>
                    <Div className={`flex grow`}>
                      <Button
                        size={"medium"}
                        disabled={!isValid}
                        onPress={async () => {
                          actionSheetRef.current?.close();
                          await submit();
                        }}
                        intent={"primary"}
                      >
                        {edit ? "Spremi" : "Dalje"}
                      </Button>
                    </Div>
                  </Div>
                </Div>
              )}
            </Form>
          </ScrollView>
        </Div>
      </SafeArea>
    </>
  );
};
