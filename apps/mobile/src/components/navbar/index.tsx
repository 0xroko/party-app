import { Div, Img, Text } from "@components/index";
import { logOut } from "@lib/actions/auth";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Pressable } from "react-native";
import { ArrowLeftIcon, Cog6ToothIcon } from "react-native-heroicons/outline";
import * as DropdownMenu from "zeego/dropdown-menu";

// import Logo from './logo.svg';

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
            logOut(true);
          }}
          key="2"
        >
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

import { PressableProps } from "react-native";

interface NavBarItemProps extends PressableProps {
  children?: React.ReactNode | React.ReactNode[];
  isDropdown?: boolean;
}

export const NavBarItem = ({
  children,
  isDropdown = false,
  ...props
}: NavBarItemProps) => {
  if (isDropdown)
    return <Div className={`flex flex-row items-center  p-2`}>{children}</Div>;

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
  showBackButton?: boolean;
  showNavBar?: boolean;
}

export const NavBar = ({
  children,
  includeDefaultTrailing = true,
  leadingLogo = false,
  showBackButton = true,
  showNavBar = true,
}: NavBarProps) => {
  const navigationState = useNavigationState((state) => state.routes);
  const navigation = useNavigation();

  const lastRouteName = navigationState.slice(-2)[0];

  const explicitTitle = (navigationState.slice(-1)[0].params as any)
    ?.previousScreenName;

  return (
    <Div>
      {showNavBar && (
        <Div
          className={`flex px-3 flex-row items-center justify-between py-3 h-16`}
        >
          {leadingLogo ? (
            <Div className={`flex flex-row g-2 justify-start items-center`}>
              <Img
                contentFit="cover"
                className={`w-12 ml-1 aspect-square`}
                source={require("../../../assets/icn-appx0-5.png")}
              ></Img>
              <Text className={`text-white font-figtree-bold `}>Party App</Text>
            </Div>
          ) : showBackButton ? (
            <Pressable onPress={() => navigation.goBack()}>
              <Div className={`flex p-3 g-4 flex-row items-center`}>
                <ArrowLeftIcon color={"#fff"} size={20} strokeWidth={2.4} />
                <Text
                  className={`text-accents-12 font-figtree-bold leading-[20]`}
                >
                  {explicitTitle ? explicitTitle : lastRouteName.name}
                </Text>
              </Div>
            </Pressable>
          ) : null}
          <Div
            className={`flex g-3 flex-row ${showBackButton ? "" : "ml-auto"}`}
          >
            {children && children}
            {includeDefaultTrailing && <DefaultNavBarTrailing />}
          </Div>
        </Div>
      )}
    </Div>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
};
