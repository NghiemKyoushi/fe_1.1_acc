import * as React from "react";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import {
  Control,
  Controller,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import styled from "@emotion/styled/macro";
import TextareaAutosize from "@mui/base/TextareaAutosize";

interface State<T extends FieldValues> extends UseControllerProps<T> {
  textFieldProps?: StandardTextFieldProps;
  valueInput: string;
  // name: string;
  label: string;
  width: string;
  type: string;
  disable: boolean;
}

const TextareaComponent = <T extends FieldValues>({
  textFieldProps,
  valueInput,
  // name,
  label,
  width,
  disable,
  type,
  ...other
}: State<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController(other);
 
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // Append a new line (\n) to the textarea value
      const newValue = `${field.value}\n`;
      field.onChange(newValue);
    }
  };
  return (
    <>
      {/* {label !== undefined && (
        <label style={{ fontWeight: "bolder", width: 110 }}>{label}</label>
      )} */}
      <div
        style={{
          width: "100%",
          // padding: "0px 0px",
          // margin: "1px 15px",
          height: 'auto',
          backgroundColor: "transparent",
        }}
      >
        <TextField
          {...textFieldProps}
          {...field}
          maxRows={4}
          style={{
            width: "100%",
            padding: "0px 0px",
            margin: "3px 0px",
            backgroundColor: "transparent",
          }}
          sx={{
            "& .MuiInputBase-input": {
              fontSize: 14,
              height: 50,
            },
          }}
          InputProps={{
            ...textFieldProps?.InputProps,
            rows: 5,
            inputComponent: "textarea",
            onKeyDown: handleKeyDown, // Attach onKeyDown event handler
          }}
          placeholder="Nhập tại dây"
        />
      </div>
    </>
  );
};
export default TextareaComponent;
