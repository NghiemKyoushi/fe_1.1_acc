import TextField, {
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material/TextField";
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
  variantshow?: TextFieldVariants;
  textholder?: string;
  focus?: string;
  value?: string;
  disable?: string;
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
        value={props.value}
        sx={{
          "& fieldset": { border: props.border === "true" ? "none" : "" },
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
          },
          "& .MuiInputBase-input": {
            fontSize: 14,   
          },
        }}
        placeholder={props.textholder}
        onChange={props.onChange}
        disabled={props.disable === "true" ? true : false}
        variant={props.variantshow ? props.variantshow : "outlined"}
        size="small"
        autoFocus={props.focus === "true" && true}
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
