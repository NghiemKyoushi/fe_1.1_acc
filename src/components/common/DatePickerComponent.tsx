import { IconButton, Popover } from "@mui/material";
import React, { forwardRef, useState } from "react";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange, RangeKeyDict } from "react-date-range";
import dayjs from "dayjs";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { TextFieldCustom } from "./Textfield";
import { formatDate, getDateOfPresent } from "@/utils";
import { UseFormSetValue } from "react-hook-form";
import vi from "date-fns/locale/vi";
export interface DateRangePickerProps {
  fromdatename: string;
  todatename: string;
  setvalue: UseFormSetValue<any>;
  // inputValue: string;
}
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (props, ref) => {
    const { fromdatename, todatename, setvalue } = props;
    const dateFormat = "DD/MM/YYYY";
    const date = new Date();
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 7);
    const [state, setState] = useState({
      displayCalendar: false,
      inputValue: `${formatDate(previous)}-${getDateOfPresent()}`,
      anchorEl: null,
      fromDate: new Date(previous),
      toDate: new Date(),
    });
    const onAdornmentClick = (e: any) => {
      setState({ ...state, displayCalendar: true, anchorEl: e.currentTarget });
    };

    const onInputChange = (e: any) => {
      const inputValue = e.target.value;
      // const { fromDate, toDate } = processInputValue(inputValue);

      // setState({ ...state, inputValue, fromDate, toDate });
    };

    const onPopoverClose = (e: any, reason: any) => {
      setState({ ...state, displayCalendar: false, anchorEl: null });
    };

    const onSelectDateRanges = (rangesByKey: RangeKeyDict) => {
      let { startDate, endDate } = rangesByKey.selection;
      const fromDate = dayjs(startDate);
      const toDate = dayjs(endDate);
      let inputValue = "";
      if (fromDate) inputValue += fromDate.format(dateFormat);
      if (toDate) inputValue += " - " + toDate.format(dateFormat);
      setvalue(fromdatename, fromDate.format("YYYY-MM-DD"));
      setvalue(todatename, toDate.format("YYYY-MM-DD"));
      setState({
        ...state,
        fromDate: fromDate.toDate(),
        toDate: toDate.toDate(),
        inputValue,
      });
    };

    // const processInputValue = (value) => {
    //   // let [fromDate, toDate] = value.split("-").map((elm) => elm.trim());
    //   // const fromDate = dayjs(fromDate, dateFormat);
    //   // const toDate = dayjs(toDate, dateFormat);
    //   // return { fromDate, toDate };
    // };

    return (
      <div>
        <TextFieldCustom
          onChange={onInputChange}
          variantshow="outlined"
          value={state.inputValue}
          iconend={
            <IconButton
              size="small"
              style={{ width: 0 }}
              onClick={onAdornmentClick}
            >
              <DateRangeIcon style={{ fontSize: 20 }} />
            </IconButton>
          }
          {...props}
        />
        <Popover
          open={state.displayCalendar}
          anchorEl={state.anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={onPopoverClose}
        >
          <div>
            <DateRange
              locale={vi}
              ranges={[
                {
                  startDate: state.fromDate,
                  endDate: state.toDate,
                  key: "selection",
                  color: "#0068a3",
                },
              ]}
              onChange={(param) => onSelectDateRanges(param)}
              showMonthAndYearPickers={true}
              moveRangeOnFirstSelection={false}
              showDateDisplay={false}
            />
          </div>
        </Popover>
      </div>
    );
  }
);
DateRangePicker.displayName = "DateRangePicker";
