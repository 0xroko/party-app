import { Div, Text } from "@components/index";
import { cva, type VariantProps } from "class-variance-authority";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

const buttonStyles = cva(
  "w-full justify-center items-center rounded-full flex-row",
  {
    variants: {
      intent: {
        primary: "bg-accents-12 text-accents-1 hover:bg-accents-11",
        secondary: "bg-accents-1 text-accents-12 border border-accents-12",
      },
      size: {
        medium: "text-base h-10",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
    },
  }
);

const buttonTextStyles = cva("", {
  variants: {
    intent: {
      primary: "text-accents-1 ",
      secondary: "text-accents-12 ",
    },
  },
});

type MyButtonProps = VariantProps<typeof buttonStyles>;

interface ButtonProps
  extends Omit<MyButtonProps, "leadingIcon" | "trailingIcon">,
    TouchableOpacityProps {
  children?: React.ReactNode | React.ReactNode[];
  leadingIcon?: React.ReactNode | React.ReactNode[];
  trailingIcon?: React.ReactNode | React.ReactNode[];
}

export const Button = ({
  children,
  size,
  intent,
  leadingIcon,
  trailingIcon,
  ...o
}: ButtonProps) => {
  const style = buttonStyles({
    intent,
    size,
  });

  return (
    <TouchableOpacity activeOpacity={0.9} {...o}>
      <Div className={style}>
        {leadingIcon && <Div className={`mr-2`}>{leadingIcon}</Div>}
        <Text className={`${buttonTextStyles({ intent })} font-[figtreeBold]`}>
          {children}
        </Text>
        {trailingIcon && <Div className={`ml-2`}>{trailingIcon}</Div>}
      </Div>
    </TouchableOpacity>
  );
};
