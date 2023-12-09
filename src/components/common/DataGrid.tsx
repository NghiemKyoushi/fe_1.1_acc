import React, { useState, useEffect, useCallback } from "react";
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
  GridRowModel,
  GridCellParams,
  MuiEvent,
  useGridApiRef,
  GridSelectionModel,
} from "@mui/x-data-grid";
import { styled } from "@mui/material";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>Không có dữ liệu</Box>
    </StyledGridOverlay>
  );
}
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
  // border: 0,
  // color:
  //   theme.palette.mode === "light"
  //     ? "rgba(0,0,0,.85)"
  //     : "rgba(255,255,255,0.85)",
  // fontFamily: [
  //   "-apple-system",
  //   "BlinkMacSystemFont",
  //   '"Segoe UI"',
  //   "Roboto",
  //   '"Helvetica Neue"',
  //   "Arial",
  //   "sans-serif",
  //   '"Apple Color Emoji"',
  //   '"Segoe UI Emoji"',
  //   '"Segoe UI Symbol"',
  // ].join(","),
  // WebkitFontSmoothing: "auto",
  // letterSpacing: "normal",
  // "& .MuiDataGrid-columnsContainer": {
  //   backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
  // },
  // // "& .MuiDataGrid-iconSeparator": {
  // //   display: "none",
  // // },
  // "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
  //   borderBottom: `1px solid ${
  //     theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
  //   }`,
  // },
  // "& .MuiDataGrid-cell": {
  //   color:
  //     theme.palette.mode === "light"
  //       ? "rgba(0,0,0,.85)"
  //       : "rgba(255,255,255,0.65)",
  // },
  // "& .MuiDataGrid-columnHeader, .MuiDataGrid-columnHeader": {
  //   backgroundColor: "#F1F3F9",
  // },
  // "& .super-app-theme--header": {
  //   height: 20,
  // },
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
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    borderRight: `1px solid ${
      theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
    }`,
  },
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
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
  // "& .MuiPaginationItem-root": {
  //   borderRadius: 0,
  // },
}));
export interface FilterCOmponent {
  itemFilter?: Array<GridFilterItem>;
  columns: Array<GridColDef>;
  dataInfo: Array<GridValidRowModel>;
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
  processRowUpdate?: (newRow: any) => void;
  handleGetListOfSelect?: (value: Array<string | number>) => void;
  checkboxSelection?: boolean;
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
    checkboxSelection,
    onPageChange,
    onPageSizeChange,
    handleSortModelChange,
    processRowUpdate,
    handleGetListOfSelect,
  } = props;
  const processRowUpdate1 = (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel
  ) => {
    const updatedRow = { ...newRow, isNew: false };
    processRowUpdate && processRowUpdate(updatedRow);
    return updatedRow;
  };
  const handleGetSelect = (newSelectionModel: GridSelectionModel) => {
    if (newSelectionModel && newSelectionModel.length > 0) {
      handleGetListOfSelect?.(newSelectionModel);
    }
  };

  const handleCellKeyDown = (
    params: GridCellParams,
    event: React.KeyboardEvent
  ) => {
    // Prevent default behavior for arrow keys on the main grid
    if (event.key.startsWith("Arrow")) {
      // event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <StyledDataGrid
      
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        rows={dataInfo}
        onCellKeyDown={handleCellKeyDown} // Custom onCellKeyDown handler to prevent default behavior for arrow keys
        disableSelectionOnClick
        isCellEditable={() => false}
        {...dataInfo}
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
        processRowUpdate={processRowUpdate1}
        experimentalFeatures={{ newEditingApi: true }}
        editMode="row"
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
        components={{
          NoRowsOverlay: dataInfo.length < 1 ? CustomNoRowsOverlay : undefined,
        }}
        checkboxSelection={checkboxSelection ? true : false}
        onSelectionModelChange={handleGetSelect}
        componentsProps={{
          pagination: { classes: null },
          filterPanel: {
            // : (event: any) => {
            //   console.log("check22222222222", event);
            //   // if (event.key === 'Escape') {
            //   //     apiRef.current.hideFilterPanel()
            //   // }
            // },
            filterFormProps: {
              deleteIconProps: {
                sx: {
                  "& .MuiSvgIcon-root": {
                    color: "#d32f2f",
                  },
                  justifyContent: "center",
                },
              },
              operatorInputProps: {
                // disabled: true, // If you only want to disable the operator
                sx: { display: "none" }, // If you want to remove it completely
              },
            },
          },
        }}
        // onCellClick={(
        //   params: GridCellParams,
        //   event: MuiEvent<React.MouseEvent>
        // ) => {
        //   event.defaultMuiPrevented = true;
        // }}
        // onKeyDown={(event: any) => {
        //   if (event.keyCode === 37 || event.keyCode === 39) {
        //     event.preventDefault();
        //   }
        // }}
        // onCellKeyDown={handleKeyDown}
      />
    </div>
  );
}
