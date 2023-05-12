import { Div } from "@components/index";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

interface PartyCoverProps {
  children?: React.ReactNode | React.ReactNode[];
  imgUri?: string;
  height?: number | string;
}

export const PartyCover = ({ children, imgUri, height }: PartyCoverProps) => {
  return (
    <Div
      className={`absolute`}
      style={{
        height: height ?? "55%",
        width: "100%",
      }}
    >
      <Image
        style={{
          height: "100%",
          width: "100%",
          opacity: 0.5,
        }}
        source={{ uri: imgUri }}
      ></Image>
      <LinearGradient
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        // Background Linear Gradient
        locations={[0.0, 0.3, 0.9]}
        colors={["rgba(0,0,0,0.7)", "transparent", "rgba(0,0,0,1)"]}
      />
    </Div>
  );
};
