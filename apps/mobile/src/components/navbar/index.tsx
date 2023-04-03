import { Div, T, Text } from "@components/index";
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
        <Div className={` p-2`}>
          <Cog6ToothIcon size={24} strokeWidth={2} color={"#fff"} />
        </Div>
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

import { PressableProps } from "react-native";

interface NavBarItemProps extends PressableProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const NavBarItem = ({ children, ...props }: NavBarItemProps) => {
  return (
    <Pressable {...props}>
      <Div className={`flex flex-row items-center  p-2`}>{children}</Div>
    </Pressable>
  );
};

interface NavBarProps {
  children?: React.ReactNode | React.ReactNode[];
  includeDefaultTrailing?: boolean;
  leadingLogo?: boolean;
}

export const NavBar = ({
  children,
  includeDefaultTrailing = true,
  leadingLogo = false,
}: NavBarProps) => {
  const navigationState = useNavigationState((state) => state.routes);
  const navigation = useNavigation();

  const lastRouteName = navigationState.slice(-2)[0];

  const explicitTitle = (navigationState.slice(-1)[0].params as any)
    ?.previousScreenName;

  return (
    <Div className={`flex px-4 flex-row items-center justify-between py-3 `}>
      {leadingLogo ? (
        <T className={`text-lg font-figtree-bold text-accents-12 px-2`}>LOGO</T>
      ) : (
        <Pressable onPress={() => navigation.goBack()}>
          <Div className={`flex   p-3 g-4 flex-row items-center`}>
            <ArrowLeftIcon color={"#fff"} size={20} strokeWidth={2.4} />
            <Text className={`text-accents-12 font-figtree-bold leading-[20]`}>
              {explicitTitle ? explicitTitle : lastRouteName.name}
            </Text>
          </Div>
        </Pressable>
      )}
      <Div className={`flex g-3 flex-row`}>
        {children && children}
        {includeDefaultTrailing && <DefaultNavBarTrailing />}
      </Div>
    </Div>
  );
};
