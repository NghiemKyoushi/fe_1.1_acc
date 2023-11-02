import { useState, useEffect } from "react";
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
  GridSortModel,
  viVN,
  GridValidRowModel,
  GridRowIdGetter,
} from "@mui/x-data-grid";
import SyncIcon from "@mui/icons-material/Sync";
import { Button, styled } from "@mui/material";
import { number } from "yup";

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

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color:
    theme.palette.mode === "light"
      ? "rgba(0,0,0,.85)"
      : "rgba(255,255,255,0.85)",
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  WebkitFontSmoothing: "auto",
  letterSpacing: "normal",
  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
  },
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  // "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
  //   borderRight: `1px solid ${
  //     theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
  //   }`,
  // },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
  "& .MuiDataGrid-cell": {
    color:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,.85)"
        : "rgba(255,255,255,0.65)",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeader": {
    backgroundColor: "#F1F3F9",
  },
  "& .super-app-theme--header": {
    height: 20,
  },
  // "& .MuiPaginationItem-root": {
  //   borderRadius: 0,
  // },
}));
export interface FilterCOmponent {
  itemFilter?: GridFilterItem[];
  columns: GridColDef[];
  dataInfo: GridValidRowModel[];
  pageSize?: number;
  page?: number;
  rowCount?: number;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (page: number) => void;
  handleSortModelChange?: (sortModel: GridSortModel) => void;
  disableFilter?: boolean;
  isPage?: boolean;
  getRowId: GridRowIdGetter<GridValidRowModel>;
}
export default function TableDataComponent(props: FilterCOmponent) {
  const {
    dataInfo,
    columns,
    getRowId,
    rowCount,
    pageSize,
    page,
    loading,
    disableFilter,
    isPage,
    onPageChange,
    onPageSizeChange,
    handleSortModelChange,
  } = props;

  //paging
  // const [filterModel, setFilterModel] = useState<GridFilterModel>({
  //   items: itemFilter,
  // });
  function generateRandom() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  return (
    <Box
      sx={{
        width: "100%",
        // height: "100%",
        "& .super-app-theme--header": {
          backgroundColor: "rgba(255, 7, 0, 0.55)",
        },
      }}
    >
      <StyledDataGrid
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        rows={dataInfo}
        columns={columns}
        //sorting
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        //pagination
        loading={loading}
        paginationMode="server"
        rowCount={rowCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(page) => {
          if (onPageChange) {
            onPageChange(page);
          }
        }}
        hideFooterPagination={isPage ? true : false}
        autoHeight={true}
        disableColumnFilter={disableFilter ? true : false}
        rowsPerPageOptions={[5, 10, 20, 30, 100]}
        onPageSizeChange={(pageSize) => {
          if (onPageSizeChange) {
            onPageSizeChange(pageSize);
          }
        }}
        rowHeight={40}
        // disableSelectionOnClick ={true}
        getRowId={getRowId}
        // onFilterModelChange={(model) => setFilterModel(model)}
        componentsProps={{
          pagination: { classes: null },
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
    </Box>
  );
}
