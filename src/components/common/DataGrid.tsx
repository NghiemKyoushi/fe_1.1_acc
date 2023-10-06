import * as React from "react";
import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import {
  GridFilterInputValueProps,
  DataGrid,
  GridFilterItem,
  GridFilterModel,
  GridFilterOperator,
  GridColDef,
  GridPagination,
  GridFilterInputMultipleValueProps,
  GridFilterInputMultipleSingleSelectProps,
} from "@mui/x-data-grid";
import SyncIcon from "@mui/icons-material/Sync";
import { Button } from "@mui/material";

interface OperatorsProps {
  inputComponent:
    | React.JSXElementConstructor<GridFilterInputValueProps>
    | React.JSXElementConstructor<GridFilterInputMultipleValueProps>
    | React.JSXElementConstructor<GridFilterInputMultipleSingleSelectProps>;
  value: string;
  label?: string;
}
export const Operators = (props: OperatorsProps) => {
  const { inputComponent, value, label } = props;

  const FilterOperator: GridFilterOperator[] = [
    {
      label: label,
      value: value,
      getApplyFilterFn: (filterItem: GridFilterItem) => {
        return null;
      },
      InputComponent: inputComponent,
    },
  ];
  return FilterOperator;
};
export interface FilterCOmponent {
  // inputFilterComponent?: GridFilterOperator<any, any, any>[];
  itemFilter: GridFilterItem[];
  // operators: GridFilterOperator[];
  columns: GridColDef[];
  dataInfo: Array<T>;
}
export default function CustomMultiValueOperator(props: FilterCOmponent) {
  const { dataInfo, columns, itemFilter } = props;

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: itemFilter,
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={dataInfo}
        columns={columns}
        // filterModel={filterModel}
        // onFilterModelChange={(model) => setFilterModel(model)}
        componentsProps={{
          filterPanel: {
            filterFormProps: {
              operatorInputProps: {
                disabled: true, // If you only want to disable the operator
                sx: { display: "none" }, // If you want to remove it completely
              },
            },
          },
        }}
      />
    </div>
  );
}
