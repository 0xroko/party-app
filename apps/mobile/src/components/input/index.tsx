import { Div, StyledInput, Text } from "@components/index";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  children?: React.ReactNode | React.ReactNode[];
  leading?: React.ReactNode | React.ReactNode[];
  error?: string | undefined | null;
  disabled?: boolean;
  trailing?: React.ReactNode | React.ReactNode[];
}

export const Input = forwardRef(
  (
    { children, leading, error, disabled, trailing, ...p }: InputProps,
    ref: any
  ) => {
    const inputStyles = cva(
      "h-10 bg-accents-1 border flex flex-grow font-figtree-medium px-4 rounded-r-full flex-row",
      {
        variants: {
          leading: {
            false: "border-l rounded-l-full",
          },
          state: {
            error: "border-error-primary text-error-primary",
            disabled: "border-accents-4 text-accents-4",
            default: "border-accents-12 text-accents-12",
          },
        },
      }
    );

    const leadingStyles = cva(
      "border-y border-l rounded-l-full flex justify-center px-4 ",
      {
        variants: {
          state: {
            error: "border-error-primary text-error-primary",
            disabled: "border-accents-4 text-accents-4",
            default: "border-accents-12 text-accents-12 ",
          },
        },
      }
    );

    // TODO: napp colors package jer nativewind ne radi s rel importima u tailwind.conf
    const placeHolderStyles = cva("", {
      variants: {
        state: {
          error: "#822025",
          disabled: "#232323",
          default: "#323232",
        },
      },
    });

    const state = disabled ? "disabled" : error ? "error" : "default";

    return (
      <Div className={`w-full`}>
        <Div
          className={`w-full flex flex-row h-10 text-accents-1 rounded-full mt-9`}
        >
          {leading && <Div className={leadingStyles({ state })}>{leading}</Div>}
          <StyledInput
            placeholderTextColor={placeHolderStyles({ state })}
            ref={ref}
            {...p}
            cursorColor={placeHolderStyles({ state })}
            editable={disabled ? false : p.editable}
            selectTextOnFocus={disabled ? false : p.selectTextOnFocus}
            className={inputStyles({ leading: !!leading, state })}
          ></StyledInput>
        </Div>
        {error && !disabled && (
          <Text className={`text-error-primary font-figtree-medium mt-3`}>
            <Text className={`font-figtree-bold`}>Greška: </Text>
            {error}
          </Text>
        )}
      </Div>
    );
  }
);
