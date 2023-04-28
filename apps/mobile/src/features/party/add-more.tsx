import { Div, Text } from "@components/index";
import { SafeArea } from "@components/safe-area";
import { FC } from "react";
// import { AddressAutofill } from '@mapbox/search-js-react';
import { Button } from "@components/button";
import { uploadPartyCover } from "@lib/actions/img";
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

export const PartyAddMore: FC<
  NativeStackScreenProps<StackNavigatorParams, "party-add-more">
> = ({ navigation, route }) => {
  const partyId = route.params.id;

  return (
    <SafeArea>
      <Section>
        <SectionTitle
          title={"Detalji partyja"}
          description={"Slika? Invajtaj?"}
        />
        <Button
          onPress={async () => {
            await uploadPartyCover(partyId);
          }}
        >
          Dodaj cover
        </Button>
      </Section>
    </SafeArea>
  );
};
