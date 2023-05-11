import { Div, T } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { FC, useEffect } from "react";
// import { AddressAutofill } from '@mapbox/search-js-react';
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Spinner } from "@components/spinner";
import { SectionTitle } from "@features/auth/signup";
import { PartyCover, useParty } from "@features/party/id";
import { onSupabaseError } from "@lib/actions";
import { uploadPartyCover } from "@lib/actions/img";
import { supabase } from "@lib/supabase";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Field, Form } from "houseform";
import React from "react";
import { Pressable } from "react-native";
import { XMarkIcon } from "react-native-heroicons/mini";
import { useMutation } from "react-query";
import { z } from "zod";

interface SectionProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Section = ({ children }: SectionProps) => {
  return (
    <Div className={`mx-[22px] flex h-full justify-evenly`}>{children}</Div>
  );
};

interface PartyAddForm {
  description: string;
  location: string;
  name: string;
  start_date: number;
  start_time: number;
}

const useMutatePartyTags = (partyId: string) => {
  const m = useMutation(async (tags: string[]) => {
    const { data, error } = await supabase
      .from("Party")
      .update({ tags })
      .eq("id", partyId);
    if (error) {
      onSupabaseError(error);
    }
  });

  return m;
};

export const PartyAddMore: FC<
  NativeStackScreenProps<StackNavigatorParams, "party-add-more">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  const [initialWasSet, setInitialWasSet] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);

  const { data: party, isLoading } = useParty(partyId);

  useEffect(() => {
    if (!initialWasSet && party?.tags) {
      console.log(party?.tags);
      setInitialWasSet(true);

      setTags(party?.tags || []);
    }
  }, [party]);

  const { mutateAsync: mutateTags, isLoading: isMutatingTags } =
    useMutatePartyTags(partyId);

  return (
    <>
      {dialogVisible && (
        <Div
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          className={`absolute z-50 inset-0 flex justify-center items-center`}
        >
          <Div
            className={`min-h-[200px] bg-black border border-accents-3 mx-9 rounded-3xl p-8 flex flex-col`}
          >
            <T className={`font-figtree-bold text-white text-xl mb-7`}>
              Dodaj tag
            </T>

            <Form
              onSubmit={(values) => {
                setTags([...tags, values.tag]);
              }}
            >
              {({ isValid, submit }) => (
                <>
                  <Field
                    name="tag"
                    onChangeValidate={z
                      .string()
                      .min(2, "Min. 2 znaka")
                      .max(10, "Max. 10 znakova")
                      .superRefine((val, ct) => {
                        if (tags.includes(val)) {
                          ct.addIssue({
                            code: "custom",
                            message: "Tag već postoji",
                          });
                        }
                      })}
                  >
                    {({ value, setValue, onBlur, errors }) => {
                      return (
                        <Input
                          value={value}
                          onBlur={onBlur}
                          onChangeText={(text) => setValue(text)}
                          placeholder={"Tag"}
                          error={errors?.[0]}
                        />
                      );
                    }}
                  </Field>
                  <Div className={`flex flex-row justify-end mt-8 g-3`}>
                    <Button
                      intent="secondary"
                      onPress={() => {
                        setDialogVisible(false);
                      }}
                    >
                      Odustani
                    </Button>
                    <Button
                      disabled={!isValid}
                      onPress={() => {
                        submit();
                        setDialogVisible(false);
                      }}
                    >
                      Dodaj
                    </Button>
                  </Div>
                </>
              )}
            </Form>
          </Div>
        </Div>
      )}
      <SafeArea gradient={false} midGradient={false}>
        {isLoading ? (
          <Div className={`flex-1 justify-center items-center`}>
            <Spinner />
          </Div>
        ) : (
          <>
            <PartyCover height={"50%"} imgUri={party?.imageUrl} />
            <Section>
              <SectionTitle
                textShadow
                title={"Detalji partija"}
                description={"Slika? Tagovi?"}
              />

              <Div className={`flex g-7`}>
                <Div className={`flex g-2`}>
                  <T className={`font-figtree-bold text-white text-xl mt-4`}>
                    Tagovi
                  </T>
                  <Div
                    className={`flex flex-row min-h-[150px] g-4 bg-accents-1 rounded-2xl p-5 border-accents-2 border`}
                  >
                    {tags.map((tag, i) => {
                      return (
                        <Div
                          className={`px-3 py-1.5 bg-white border flex-row h-9 border-black rounded-full flex justify-center items-center g-2`}
                          key={i}
                        >
                          <T
                            className={`text-black font-figtree-semi-bold text-base ml-2`}
                          >
                            {tag}
                          </T>
                          <Pressable
                            onPress={() => {
                              setTags(tags.filter((t) => t !== tag));
                            }}
                          >
                            <XMarkIcon size={24} color={"black"} />
                          </Pressable>
                        </Div>
                      );
                    })}
                  </Div>
                </Div>
                <Div className={`w-full flex g-4 flex-row`}>
                  <Button
                    intent="secondary"
                    className={`flex-1`}
                    onPress={() => {
                      setDialogVisible(true);
                    }}
                  >
                    Dodaj tag
                  </Button>
                  <Button
                    intent="secondary"
                    className={`flex-1`}
                    onPress={async () => {
                      await uploadPartyCover(partyId);
                    }}
                  >
                    Dodaj cover
                  </Button>
                </Div>
                <Div>
                  <Button
                    loading={isMutatingTags}
                    onPress={async () => {
                      await mutateTags(tags);
                      navigation.navigate("party", { id: partyId });
                    }}
                  >
                    Spremi
                  </Button>
                </Div>
              </Div>
            </Section>
          </>
        )}
      </SafeArea>
    </>
  );
};
