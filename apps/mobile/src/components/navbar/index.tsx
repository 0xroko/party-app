import { Div, Img, T, Text } from "@components/index";
import { logOut } from "@lib/actions/auth";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Pressable, View } from "react-native";
import { ArrowLeftIcon, Cog6ToothIcon } from "react-native-heroicons/outline";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Image } from 'react-native';

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
            logOut();
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
import Svg, { Path } from "react-native-svg";

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
    <Div
      className={`flex px-3 flex-row items-center justify-between py-3 h-16`}
    >
      {leadingLogo ? (
        <T className={`text-lg font-figtree-bold text-accents-12 px-2`}>
          <View style={styles.container}>
            <Svg viewBox="0 0 580 378" fill="none" style={{ width: 70, height: 40 }}>
              {/* <Path d="M16.993 6.667H3.227l6.883 6.883 6.883-6.883z" fill="#000" /> */}
              <Path d="M0 119.5L52 0L297 76.5L260.5 167.5L580 199V329L106.5 378L52 322.5V174L0 119.5Z" fill="white" />
              <Path d="M127.171 277.824V259.806H148.192C152.577 259.806 156.152 258.376 158.917 255.516C161.777 252.656 163.207 248.89 163.207 244.219C163.207 241.168 162.492 238.499 161.062 236.211C159.632 233.828 157.678 231.969 155.199 230.634C152.72 229.299 149.86 228.68 146.619 228.775H127.171V210.9L147.048 210.757C154.103 210.662 160.347 212.092 165.781 215.047C171.215 217.907 175.457 221.863 178.508 226.916C181.559 231.873 183.084 237.641 183.084 244.219C183.084 250.702 181.606 256.469 178.651 261.522C175.696 266.575 171.644 270.579 166.496 273.534C161.348 276.394 155.39 277.824 148.621 277.824H127.171ZM109.868 311V210.9H129.459V311H109.868ZM235.533 311L234.818 296.557V274.821C234.818 270.531 234.341 266.908 233.388 263.953C232.434 260.902 230.957 258.614 228.955 257.089C227.048 255.468 224.474 254.658 221.233 254.658C218.373 254.658 215.799 255.278 213.511 256.517C211.223 257.756 209.268 259.758 207.648 262.523L190.488 256.66C191.822 253.609 193.777 250.654 196.351 247.794C198.925 244.839 202.261 242.455 206.361 240.644C210.555 238.737 215.656 237.784 221.662 237.784C228.812 237.784 234.77 239.071 239.537 241.645C244.399 244.219 248.021 248.032 250.405 253.085C252.788 258.042 253.932 264.144 253.837 271.389L253.408 311H235.533ZM215.799 312.716C207.219 312.716 200.545 310.809 195.779 306.996C191.107 303.183 188.772 297.796 188.772 290.837C188.772 283.21 191.298 277.49 196.351 273.677C201.499 269.768 208.696 267.814 217.944 267.814H236.105V281.828H224.522C218.325 281.828 214.035 282.591 211.652 284.116C209.268 285.546 208.077 287.596 208.077 290.265C208.077 292.362 209.03 294.031 210.937 295.27C212.843 296.414 215.513 296.986 218.945 296.986C221.995 296.986 224.712 296.271 227.096 294.841C229.479 293.316 231.338 291.409 232.673 289.121C234.103 286.738 234.818 284.307 234.818 281.828H239.823C239.823 291.552 237.916 299.131 234.103 304.565C230.385 309.999 224.283 312.716 215.799 312.716ZM282.895 273.391C282.895 265.669 284.372 259.282 287.328 254.229C290.378 249.176 294.239 245.411 298.911 242.932C303.677 240.453 308.635 239.214 313.783 239.214V257.518C309.397 257.518 305.25 258.042 301.342 259.091C297.528 260.14 294.43 261.856 292.047 264.239C289.663 266.622 288.472 269.673 288.472 273.391H282.895ZM269.596 311V239.5H288.472V311H269.596ZM353.952 312.716C346.04 312.716 340.034 310.762 335.934 306.853C331.93 302.944 329.928 297.367 329.928 290.122V217.192H348.804V285.975C348.804 289.026 349.472 291.361 350.806 292.982C352.141 294.507 354.095 295.27 356.669 295.27C357.623 295.27 358.671 295.079 359.815 294.698C360.959 294.221 362.151 293.554 363.39 292.696L369.968 306.853C367.68 308.569 365.106 309.951 362.246 311C359.482 312.144 356.717 312.716 353.952 312.716ZM318.345 255.516V239.5H366.679V255.516H318.345ZM397.044 341.316C394.47 341.316 391.61 340.792 388.464 339.743C385.414 338.79 382.697 337.646 380.313 336.311L387.32 321.01C388.941 321.868 390.419 322.535 391.753 323.012C393.183 323.584 394.423 323.87 395.471 323.87C397.473 323.87 399.237 323.298 400.762 322.154C402.288 321.105 403.527 319.532 404.48 317.435L412.917 297.558L435.654 239.5H456.389L423.928 317.149C421.926 321.916 419.829 326.11 417.636 329.733C415.444 333.451 412.727 336.311 409.485 338.313C406.339 340.315 402.192 341.316 397.044 341.316ZM407.912 311L375.165 239.5H395.9L419.781 297.558L425.93 311H407.912Z" fill="black" />
              <Path d="M81.0726 100.961L83.4169 90.0871L87.7443 73.9368C88.5984 70.7492 88.9655 67.9626 88.8455 65.5769C88.7445 63.1204 88.1021 61.1262 86.9183 59.5943C85.8243 58.0105 84.0731 56.8959 81.6647 56.2506C79.5396 55.6812 77.5037 55.6292 75.557 56.0945C73.6102 56.5598 71.7595 57.6583 70.0049 59.3898L58.422 51.6171C60.021 49.6161 62.0615 47.8093 64.5434 46.1967C67.0443 44.5133 69.998 43.4068 73.4046 42.877C76.9009 42.2955 80.8803 42.6026 85.3429 43.7983C90.6555 45.2218 94.8264 47.3643 97.8557 50.2259C100.956 53.1064 102.888 56.661 103.653 60.8897C104.437 65.0476 104.072 69.8088 102.559 75.1733L94.3541 104.52L81.0726 100.961ZM66.0682 98.307C59.6931 96.5988 55.1143 93.8535 52.3318 90.0711C49.6201 86.3077 48.957 81.8405 50.3426 76.6696C51.861 71.0029 54.8769 67.2558 59.3903 65.4283C63.9936 63.549 69.7307 63.5299 76.6016 65.371L90.0956 68.9867L87.3056 79.3994L78.6992 77.0933C74.0949 75.8596 70.7555 75.5721 68.681 76.231C66.6254 76.819 65.3319 78.1047 64.8005 80.0881C64.3829 81.6464 64.7591 83.0758 65.929 84.3763C67.118 85.6059 68.9875 86.5624 71.5375 87.2456C73.8042 87.853 75.9653 87.8627 78.0209 87.2747C80.0955 86.6158 81.8563 85.5692 83.3035 84.1349C84.8406 82.6488 85.8558 80.9848 86.3493 79.1431L90.0681 80.1396C88.1321 87.3647 85.2065 92.6164 81.2913 95.8948C77.4469 99.1922 72.3725 99.9962 66.0682 98.307ZM101.219 129.135L121.148 54.7589L134.324 58.2892L132.554 68.2922L115.245 132.893L101.219 129.135ZM136.641 117.217C132.178 116.021 128.693 113.872 126.183 110.771C123.745 107.688 122.271 103.838 121.761 99.2226C121.252 94.6068 121.756 89.4656 123.275 83.7988C124.812 78.0612 126.946 73.3565 129.676 69.6846C132.425 65.9419 135.626 63.3453 139.279 61.8947C143.003 60.4631 147.097 60.3452 151.559 61.541C156.447 62.8506 160.358 65.1133 163.292 68.329C166.298 71.5636 168.232 75.5363 169.095 80.247C169.978 84.8869 169.651 90.0756 168.113 95.8132C166.595 101.48 164.284 106.137 161.181 109.785C158.078 113.433 154.416 115.906 150.196 117.205C146.047 118.523 141.529 118.527 136.641 117.217ZM136.473 103.392C139.023 104.076 141.426 104.036 143.68 103.274C146.005 102.53 148.038 101.177 149.778 99.2136C151.519 97.2506 152.778 94.817 153.557 91.9128C154.335 89.0086 154.461 86.2713 153.935 83.7009C153.48 81.1495 152.422 79.0059 150.761 77.2703C149.19 75.4828 147.13 74.2475 144.58 73.5642C142.171 72.9188 139.84 72.9775 137.586 73.74C135.332 74.5026 133.37 75.8749 131.7 77.8569C130.049 79.768 128.834 82.1757 128.056 85.08C127.278 87.9842 127.116 90.712 127.572 93.2634C128.027 95.8148 129.004 97.9748 130.504 99.7433C132.075 101.531 134.065 102.747 136.473 103.392ZM165.564 146.376L185.493 72L198.668 75.5303L196.899 85.5333L179.589 150.134L165.564 146.376ZM200.986 134.458C196.523 133.262 193.037 131.113 190.528 128.012C188.089 124.929 186.615 121.079 186.106 116.464C185.597 111.848 186.101 106.707 187.619 101.04C189.157 95.3023 191.291 90.5976 194.021 86.9257C196.77 83.183 199.971 80.5864 203.624 79.1358C207.348 77.7042 211.441 77.5863 215.904 78.782C220.792 80.0917 224.703 82.3543 227.637 85.57C230.642 88.8047 232.577 92.7774 233.44 97.4881C234.323 102.128 233.995 107.317 232.458 113.054C230.939 118.721 228.629 123.378 225.525 127.026C222.422 130.674 218.761 133.147 214.541 134.446C210.392 135.764 205.873 135.768 200.986 134.458ZM200.818 120.634C203.368 121.317 205.77 121.277 208.024 120.515C210.349 119.771 212.382 118.418 214.123 116.455C215.864 114.492 217.123 112.058 217.901 109.154C218.679 106.25 218.806 103.512 218.28 100.942C217.824 98.3906 216.766 96.247 215.106 94.5114C213.535 92.7239 211.474 91.4885 208.924 90.8053C206.516 90.1599 204.185 90.2186 201.931 90.9811C199.676 91.7437 197.714 93.116 196.044 95.098C194.394 97.0091 193.179 99.4168 192.401 102.321C191.623 105.225 191.461 107.953 191.916 110.504C192.371 113.056 193.349 115.216 194.849 116.984C196.42 118.772 198.41 119.988 200.818 120.634Z" fill="black" />

            </Svg>
          </View>
        </T>
      ) : (
        <Pressable onPress={() => navigation.goBack()}>
          <Div className={`flex p-3 g-4 flex-row items-center`}>
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

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};
