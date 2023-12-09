import {
  InputAdornment,
  StandardTextFieldProps,
  TextField,
} from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import * as React from "react";
import { forwardRef } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface NumericFormatProps {
  onChange: (event: { target: { name: string; value?: number } }) => void;
  name: string;
}

export const CurrencyNumericFormat = forwardRef<unknown, NumericFormatProps>(
  function valueInputCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.floatValue,
            },
          });
        }}
        thousandSeparator={","}
        valueIsNumericString
      />
    );
  }
);

export interface FormCurrencyFieldProps<T extends FieldValues>
  extends UseControllerProps<T> {
  textFieldProps?: StandardTextFieldProps;
  currency?: string;
  label?: string;
  InputWidth: string;
}

export const InputNumber = <T extends FieldValues>({
  textFieldProps,
  currency,
  label,
  InputWidth,
  ...other
}: FormCurrencyFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController(other);
  return (
    <>
      <TextField
        autoFocus
        tabIndex={0}
        sx={{
          "& fieldset": { border: "none" },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
          },
          "& .MuiInputBase-root.MuiOutlinedInput-root ::placeholder": {
            color: "rgba(0, 0, 0, 0.85)",
            opacity: 1,
            fontWeight: 400,
          },
        }}
        // size="small"
        {...textFieldProps}
        {...field}
        placeholder="0"
        required={!!other.rules?.required}
        InputProps={{
          ...textFieldProps?.InputProps,
          inputComponent: CurrencyNumericFormat as any,
          startAdornment: currency && (
            <InputAdornment position="start">{currency}</InputAdornment>
          ),
          style: {
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.85)",
            fontWeight: 400,
          },
        }}
        helperText={error ? error.message : null}
        error={!!error}
      />
    </>
  );
};
