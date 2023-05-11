import { Div, DivScroll, Text } from "@components/index";
import { useBottomTabBarHeightNonThrowable } from "@hooks/useBottomTabBarHeightNonThrowable";
import { logOut } from "@lib/actions/auth";
import React, { forwardRef } from "react";
import { Pressable, StatusBar, useWindowDimensions } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface SafeAreaProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  gradient?: boolean;
  midGradient?: boolean;
  pureBlack?: boolean;
}

let debug = __DEV__;

debug = false;

export const SafeArea = ({
  children,
  className,
  gradient,
  midGradient = true,
  pureBlack = false,
}: SafeAreaProps) => {
  const d = useWindowDimensions();

  const tabBarHeight = useBottomTabBarHeightNonThrowable();
  return (
    <Div
      className={`flex flex-col justify-between relative h-full bg-accents-1 text-accents-12`}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={pureBlack ? "black" : "transparent"}
        translucent
      />
      {debug && (
        <Div className={`absolute z-50 top-10 right-5`}>
          <Pressable
            onPress={async () => {
              console.log("logout");
              await logOut();
            }}
          >
            <Text className={`text-yellow-300`}>LogOut</Text>
          </Pressable>
        </Div>
      )}
      {gradient && (
        <Svg
          style={{
            position: "absolute",
            opacity: 0.6,
          }}
          height={d.height * 0.4}
          width={d.width}
        >
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="80%"
              r={"100%"}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0.536458" stopColor="#6500B7" stopOpacity="0" />
              <Stop offset="0.765625" stopColor="#6500B7" />
              <Stop offset="1" stopColor="#FFA0FF" />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={"100%"} height={"100%"} fill="url(#grad)" />
        </Svg>
      )}

      {midGradient && (
        <Svg
          style={{
            position: "absolute",
            opacity: 0.8,
            top: d.height * 0.4,
            transform: [
              {
                scale: 1.5,
              },
            ],
          }}
          height={d.height * 0.5}
          width={d.width}
        >
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="5"
            fill="url(#paint0_linear_417_1027)"
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="5"
            fill="url(#paint1_radial_417_1027)"
          />
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="5"
            fill="url(#paint2_radial_417_1027)"
          />

          <Defs>
            <LinearGradient
              id="paint0_linear_417_1027"
              x1="50%"
              y1="-10%"
              x2="50%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#430086" stopOpacity="0.0" />
              <Stop offset="0.5" stopColor="#430086" stopOpacity={"0.3"} />
              <Stop stopColor="#430086" offset={"1.0"} stopOpacity="0.0" />
            </LinearGradient>
            <RadialGradient
              id="paint1_radial_417_1027"
              cx="50%"
              cy="50%"
              r="80%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#FFA0FF" stopOpacity="0.13" />
              <Stop offset="0.5" stopColor="#FFA0FF" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="paint2_radial_417_1027"
              cx="50%"
              cy="50%"
              r="80%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#FFA0FF" stopOpacity="0.07" />
              <Stop offset="0.64" stopColor="#FFA0FF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
        </Svg>
      )}

      <Div
        className={` h-full flex flex-col ${className}`}
        style={{
          paddingTop: StatusBar.currentHeight || 0,
        }}
      >
        {children}
      </Div>
    </Div>
  );
};

interface ContentProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const Content = ({ children, className }: ContentProps) => {
  return <Div className={`mx-[18px] flex`}>{children}</Div>;
};

type ScrollViewProps = React.ComponentProps<typeof DivScroll>;

interface ContentScrollViewProps extends ScrollViewProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const ContentScrollView = forwardRef(
  ({ children, className, ...props }: ContentScrollViewProps, ref: any) => {
    const tabBarHeight = useBottomTabBarHeightNonThrowable();

    return (
      <DivScroll ref={ref} className={`mx-[18px] flex ${className}`} {...props}>
        {children}
        <Div
          style={{
            height: tabBarHeight,
            width: "100%",
            backgroundColor: "transparent",
          }}
        ></Div>
      </DivScroll>
    );
  }
);

SafeArea.Content = Content;
SafeArea.ContentScrollView = ContentScrollView;
