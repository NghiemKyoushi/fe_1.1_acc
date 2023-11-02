import TextField, { StandardTextFieldProps, TextFieldVariants } from "@mui/material/TextField";
import { FC, InputHTMLAttributes } from "react";
import { GridFilterInputValueProps } from "@mui/x-data-grid";
import { TextFieldProps } from "@mui/material/TextField";
import { InputAdornment, SvgIconProps } from "@mui/material";
import { forwardRef, ForwardedRef } from "react";

export interface CustomTextFieldProps {
  name?: string;
  label?: string;
  type?: string;
  border?: string;
  onChange?: (e: any) => void;
  textfieldprops?: TextFieldProps;
  forwardRef?: React.ForwardedRef<HTMLDivElement>;
  iconend?: React.ReactNode;
  style?: React.CSSProperties;
  variantShow?: TextFieldVariants ;
}
export const TextFieldCustom = forwardRef<HTMLDivElement, CustomTextFieldProps>(
  (props, ref) => {
    return (
      <TextField
        style={{
          width: "100%",
          padding: "0px 1px",
          margin: "0px 0px",
          backgroundColor: "transparent",
          ...props.style,
        }}
        // style={props.style}
        sx={{
          "& fieldset": { border: props.border === "true" ? "none" : "" },
        }}
        variant={props.variantShow ? props.variantShow : 'outlined'}
        size="small"
        ref={ref as ForwardedRef<HTMLDivElement>}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">{props.iconend}</InputAdornment>
          ),
        }}
        {...props}
      />
    );
  }
);
TextFieldCustom.displayName = "TextFieldCustom";
