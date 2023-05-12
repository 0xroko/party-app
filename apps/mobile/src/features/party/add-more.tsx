import { Div } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { FC, useEffect } from "react";
// import { AddressAutofill } from '@mapbox/search-js-react';
import { Button } from "@components/button";
import { PartyCover } from "@components/party-cover";
import {
  AddDialog,
  TagContainer,
  useMutatePartyTags,
  useTagsStore,
} from "@components/party-tags";
import { Spinner } from "@components/spinner";
import { SectionTitle } from "@features/auth/signup";
import { useParty } from "@hooks/query/useParty";
import { uploadPartyCover } from "@lib/actions/img";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";

interface PartyAddForm {
  description: string;
  location: string;
  name: string;
  start_date: number;
  start_time: number;
}

export const PartyAddMore: FC<
  NativeStackScreenProps<StackNavigatorParams, "party-add-more">
> = ({ navigation, route }) => {
  const partyId = route.params.id;
  const { data: party, isLoading } = useParty(partyId);

  const { setInitial, tags, setDialogVisible } = useTagsStore();

  useEffect(() => {
    // setInitial(party?.tags ?? []);
  }, [party]);

  const { mutateAsync: mutateTags, isLoading: isMutatingTags } =
    useMutatePartyTags(partyId);

  return (
    <>
      <AddDialog />
      <SafeArea gradient={false} midGradient={false}>
        {isLoading ? (
          <Div className={`flex-1 justify-center items-center`}>
            <Spinner />
          </Div>
        ) : (
          <>
            <PartyCover height={"50%"} imgUri={party?.imageUrl} />
            <Div className={`mx-4 flex h-full justify-evenly`}>
              <SectionTitle
                textShadow
                title={"Detalji partija"}
                description={"Slika? Tagovi?"}
              />

              <Div className={`flex g-4`}>
                <TagContainer />
                <Div className={`w-full flex g-4 flex-row`}>
                  {/* <Button
                    intent="secondary"
                    className={`flex-1`}
                    onPress={() => {
                      setDialogVisible(true);
                    }}
                  >
                    Dodaj tag
                  </Button> */}
                  <Button
                    intent="secondary"
                    className={`flex-1`}
                    onPress={async () => {
                      await uploadPartyCover(partyId);
                    }}
                  >
                    Dodaj pozadinu
                  </Button>
                </Div>
                <Div>
                  <Button
                    loading={isMutatingTags}
                    onPress={async () => {
                      await mutateTags(tags);
                      navigation.replace("party", {
                        id: partyId,
                        previousScreenName: "Home",
                      });
                    }}
                  >
                    Spremi
                  </Button>
                </Div>
              </Div>
            </Div>
          </>
        )}
      </SafeArea>
    </>
  );
};
