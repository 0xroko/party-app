import { Div } from "@components/index";
import { StatusBar, useWindowDimensions } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface SafeAreaProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  gradient?: boolean;
}

export const SafeArea = ({ children, className, gradient }: SafeAreaProps) => {
  const d = useWindowDimensions();

  return (
    <Div
      className={`flex flex-col justify-between  h-full bg-accents-1 text-accents-12`}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={"transparent"}
        translucent
      />
      {gradient && (
        <Svg
          style={{
            position: "absolute",
            opacity: 0.7,
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

      <Div className={`${className} pt-[30]`}>{children}</Div>
    </Div>
  );
};