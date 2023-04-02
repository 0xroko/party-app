import { Div, Text } from "@components/index";
import { cva, VariantProps } from "class-variance-authority";

const style = cva(
  "flex flex-row items-center justify-center rounded-xl px-3 py-1.5 border g-1",
  {
    variants: {
      intent: {
        primary: "bg-glass-1 text-accents-12 border-accents-12 ",
        disabled: "bg-accents-4 text-accents-9 border-accents-7",
      },
    },
    defaultVariants: {
      intent: "primary",
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
  defaultVariants: {
    intent: "primary",
  },
});

type BadgeIntent = VariantProps<typeof style>["intent"];
interface BadgeProps {
  children?: React.ReactNode | React.ReactNode[];
  intent?: BadgeIntent;
  icon?: React.ReactNode | React.ReactNode[];
}

export const Badge = ({ children, intent, icon }: BadgeProps) => {
  return (
    <Div className={style({ intent })}>
      {icon}
      <Text className={textStyle({ intent })}>{children}</Text>
    </Div>
  );
};
