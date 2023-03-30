import { Div, Text } from "@components/index";
import { logOut } from "@lib/actions/auth";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Pressable } from "react-native";
import { ArrowLeftIcon, Cog6ToothIcon } from "react-native-heroicons/outline";
import * as DropdownMenu from "zeego/dropdown-menu";

interface DefaultNavBarProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const DefaultNavBarTrailing = ({ children }: DefaultNavBarProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Cog6ToothIcon size={24} strokeWidth={2} color={"#fff"} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Log out</DropdownMenu.Label>
        <DropdownMenu.Item
          onSelect={() => {
            logOut();
          }}
          key="2"
        >
          <DropdownMenu.ItemTitle>Log out</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

interface NavBarProps {
  children?: React.ReactNode | React.ReactNode[];
  trailing?: React.ReactNode | React.ReactNode[];
}

export const NavBar = ({ children, trailing }: NavBarProps) => {
  const navigationState = useNavigationState((state) => state.routes);
  const navigation = useNavigation();

  const lastRouteName = navigationState.slice(-2)[0];

  const explicitTitle = (navigationState.slice(-1)[0].params as any)
    ?.previousScreenName;

  return (
    <Div
      className={`flex mx-[22px] flex-row items-center justify-between my-6`}
    >
      <Pressable onPress={() => navigation.goBack()}>
        <Div className={`flex g-4 flex-row items-center`}>
          <ArrowLeftIcon color={"#fff"} size={20} strokeWidth={2.4} />
          <Text className={`text-accents-12 font-figtree-bold leading-[20]`}>
            {explicitTitle ? explicitTitle : lastRouteName.name}
          </Text>
        </Div>
      </Pressable>
      <Div className={`flex g-4 flex-row`}>
        {trailing ? trailing : <DefaultNavBarTrailing />}
      </Div>
    </Div>
  );
};
