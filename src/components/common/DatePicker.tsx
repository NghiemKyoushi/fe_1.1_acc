import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextFieldCustom } from "./Textfield";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { formatDate, getDateOfPresent } from "@/utils";
import dayjs from "dayjs";

interface InputProps {
  name: string;
  setValue: UseFormSetValue<any>;
}

function DateSiglePicker({
  control,
  props,
}: {
  control: Control<any>;
  props: InputProps;
}) {
  const { name, setValue } = props;
  const valueDefault = getDateOfPresent();
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          control={control}
          name={name}
          defaultValue={new Date()}
          render={({ field: { value, onChange, ...fieldProps } }) => {
            return (
              <DatePicker
                {...fieldProps}
                value={value}
                inputFormat="DD-MM-YYYY"
                // onChange={(value: any) => {
                //   console.log("check1", value);
                //   const date = dayjs(value);
                //   setValue(name, date.format("DD-MM-YYYY"));
                // }}
                onChange={onChange}
                renderInput={(props: any) => <TextFieldCustom {...props} />}
              />
            );
          }}
        />
      </LocalizationProvider>
    </>
  );
}
export default DateSiglePicker;
