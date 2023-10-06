import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import { FC, InputHTMLAttributes } from "react";
import { GridFilterInputValueProps } from "@mui/x-data-grid";
import { TextFieldProps } from "@mui/material/TextField";
export interface CustomTextFieldProps {
  name?: string;
  label?: string;
  type?: string;
  onChange?: (e: any) => void;
  rest?: TextFieldProps;
  textFieldProps?: StandardTextFieldProps;
  forwardRef?: React.ForwardedRef<HTMLDivElement>
}
export const TextFieldCustom: FC<CustomTextFieldProps> = ({
  name,
  label,
  type,
  onChange,
  forwardRef,
  ...textFieldProps
}) => {
  const handleLowerFilterChange = (e: any) => {
    console.log("hdhddhh", e);
  };
  return (
    <TextField
      name={name}
      placeholder="From"
      label={label}
      variant="standard"
      // value={Number(filterValueState[0])}
      onChange={onChange}
      type={type}
      // inputRef={focusElementRef}
      sx={{ mr: 2, ml: 3 }}
      {...textFieldProps}
      ref ={forwardRef}
    />
  );
};
