import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, IconButton, Autocomplete } from "@mui/material";
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
  useController,
  useForm,
  useFormContext,
} from "react-hook-form";
import { TextFieldCustom } from "./Textfield";
interface resultProps {
  key: string;
  value: string;
}

interface InputProps {
  name: string;
  nameOnChange?: string;
  label?: string;
  type?: string;
  results?: Array<resultProps>;
  labelWidth?: string;
  placeHoder?: string;
  setValue: UseFormSetValue<any>;
  getData: (value: string) => void;
  border?: string;
  variantType?: string;
  disable?: boolean;
  fontSize?: number;
}

function AutoCompleteMultiple({
  control,
  props,
}: {
  control: Control<any>;
  props: InputProps;
}) {
  const {
    name,
    label,
    results,
    labelWidth,
    placeHoder,
    nameOnChange,
    setValue,
    getData,
    border,
    variantType,
    disable,
    fontSize,
  } = props;

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const { onChange, onBlur, value } = field;
          return (
            <Autocomplete
              size="small"
              multiple
              disabled={disable ? true : false}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              options={results ? results : []}
              // getOptionLabel={(option) => {
              //   return option?.value ? option?.value : "";
              // }}

              getOptionLabel={(option) => option.value}
              value={value ?? ""}
              onChange={(event, selectedOptions, reason) => {
                if (reason === "clear") {
                  onChange({}); // This onChange is from the Hook forms
                  return;
                }
                onChange(selectedOptions);
              }}
              onInputChange={(event, newInputValue) => {
                getData(newInputValue);
              }}
              sx={{
                width: `${labelWidth}%`,
                padding: "0px 32px 0px 0px",
                fontSize: 14,
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#000000",
                },
              }}
              renderInput={(params) => (
                <TextFieldCustom
                  {...params}
                  border={border}
                  type={"text"}
                  fontSize={fontSize}
                  variantshow={variantType ? "standard" : "outlined"}
                  iconend={<SearchIcon />}
                />
              )}
            />
          );
        }}
      />
    </>
  );
}

export default AutoCompleteMultiple;
