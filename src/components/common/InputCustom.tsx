import {
    InputAdornment,
    StandardTextFieldProps,
    TextField,
  } from "@mui/material";
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
  
  export const InputNumber= <T extends FieldValues>({
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
      <div
        className="field"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {label !== undefined && (
          <label
            style={{ fontWeight: "bolder", width: 110, fontSize:14 }}
          >
            {label}
          </label>
        )}
        <TextField
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#000000",
            },
            
          }}
          // disabled={props.disabled}
          size="small"
          style={{
            // width: `${width}`,
            width: `${InputWidth}`,
            padding: "0px 6px",
            margin: "1px 10px",
            backgroundColor: "transparent",
          }}
          {...textFieldProps}
          {...field}
          required={!!other.rules?.required}
          InputProps={{
            ...textFieldProps?.InputProps,
            inputComponent: CurrencyNumericFormat as any,
            startAdornment: currency && (
              <InputAdornment position="start">{currency}</InputAdornment>
            ),
          }}
          helperText={error ? error.message : null}
          error={!!error}
        />
      </div>
    );
  };
  