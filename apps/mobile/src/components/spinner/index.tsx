import { ActivityIndicator } from "react-native";

interface SpinnerProps {
  children?: React.ReactNode | React.ReactNode[];
}

export const Spinner = ({ children }: SpinnerProps) => {
  return <ActivityIndicator size="large" color="#fff" />;
};
