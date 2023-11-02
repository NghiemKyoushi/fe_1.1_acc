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
  values: string;
}

interface InputProps {
  name: string;
  nameOnChange?: string;
  label?: string;
  type?: string;
  results?: Array<resultProps>;
  labelWidth?: string;
  placeHoder?: string;
  // control: Control<T>;
  setValue: UseFormSetValue<any>;
  getData: (value: string) => void;
  border?: string;
}

function SelectSearchComponent({
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
              options={results || []}
              getOptionLabel={(option) => {
                return option?.values ? option?.values : "";
              }}
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
              sx={{ width: `${labelWidth}%`, padding: "0px 32px 0px 0px" }}
              renderInput={(params) => (
                <TextFieldCustom
                  {...params}
                  border={border}
                  type={"text"}
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

export default SelectSearchComponent;
