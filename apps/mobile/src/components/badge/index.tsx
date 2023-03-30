import { Div, Text } from "@components/index";

interface BadgeProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Badge = ({ children }: BadgeProps) => {
  return (
    <Div
      className={`flex flex-row items-center justify-center bg-accents-1 rounded-full px-3 py-1.5 border-accents-12 border`}
    >
      <Text className={`text-accents-12 font-figtree-bold`}>{children}</Text>
    </Div>
  );
};
