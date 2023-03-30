import { Div, Text } from "@components/index";
import { cva, VariantProps } from "class-variance-authority";

const style = cva(
  "flex flex-row items-center justify-center rounded-full px-3 py-1.5 border",
  {
    variants: {
      intent: {
        primary: "bg-accents-1 text-accents-12 border-accents-12 ",
        disabled: "bg-accents-4 text-accents-9 border-accents-7",
      },
    },
  }
);

const textStyle = cva("font-figtree-bold", {
  variants: {
    intent: {
      primary: "text-accents-12",
      disabled: "text-accents-9",
    },
  },
});

type BadgeIntent = VariantProps<typeof style>["intent"];
interface BadgeProps {
  children?: React.ReactNode | React.ReactNode[];
  intent?: BadgeIntent;
}

export const Badge = ({ children, intent }: BadgeProps) => {
  return (
    <Div className={style({ intent })}>
      <Text className={textStyle({ intent })}>{children}</Text>
    </Div>
  );
};
