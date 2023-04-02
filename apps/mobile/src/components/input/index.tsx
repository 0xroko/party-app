import { Div, StyledInput, Text } from "@components/index";
import { cva } from "class-variance-authority";
import { forwardRef } from "react";
import { TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  children?: React.ReactNode | React.ReactNode[];
  leading?: React.ReactNode | React.ReactNode[];
  error?: string | undefined | null;
  disabled?: boolean;
  large?: boolean;
  label?: string;
  trailing?: React.ReactNode | React.ReactNode[];
}

export const Input = forwardRef(
  (
    {
      children,
      leading,
      error,
      disabled,
      trailing,
      numberOfLines,
      large,
      ...p
    }: InputProps,
    ref: any
  ) => {
    if (large === true) {
      leading = undefined;
    }

    const inputStyles = cva(
      `h-full flex-1 blur-md filter bg-glass-1 border flex flex-grow font-figtree-medium px-4 flex-row`,
      {
        variants: {
          leading: {
            false: "",
          },
          large: {
            true: "rounded-md py-3",
            false: "rounded-r-2xl",
          },
          state: {
            error: "border-error-primary text-error-primary",
            disabled: "border-accents-4 text-accents-4",
            default: "border-accents-12 text-accents-12",
          },
        },
        compoundVariants: [
          {
            leading: false,
            large: true,
            className: "rounded-2xl",
          },
          {
            leading: false,
            large: false,
            className: "border-l rounded-l-2xl",
          },
        ],
      }
    );

    const leadingStyles = cva(
      "border-y border-l blur-md filter bg-glass-1 rounded-l-2xl flex justify-center px-4",
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
          default: "#444444",
        },
      },
    });

    const state = disabled ? "disabled" : error ? "error" : "default";

    return (
      <Div className={`w-full max-w-full`}>
        {p.label && (
          <Text className={`text-accents-11 font-figtree-semi-bold text-sm`}>
            {p.label}
          </Text>
        )}

        <Div
          className={`w-full flex flex-row ${
            large ? "h-40" : "h-10"
          } text-accents-1  mt-2`}
        >
          {leading && <Div className={leadingStyles({ state })}>{leading}</Div>}
          <StyledInput
            placeholderTextColor={placeHolderStyles({ state })}
            ref={ref}
            {...p}
            cursorColor={placeHolderStyles({ state })}
            textAlignVertical={large ? "top" : "center"}
            editable={disabled ? false : p.editable}
            multiline={large ? true : p.multiline}
            selectTextOnFocus={disabled ? false : p.selectTextOnFocus}
            numberOfLines={large ? 4 : 1}
            className={inputStyles({
              leading: !!leading,
              state,
              large: !!large,
            })}
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
