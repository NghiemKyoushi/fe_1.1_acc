import {
  fetchBills,
  fetchFilterBills,
  fetchSumBills,
} from "@/actions/BillManagementActions";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { ColBillInfo } from "@/models/BillManagementModel";
import { RootState } from "@/reducers/rootReducer";
import { formatDateTime } from "@/utils";
import { Box, Button } from "@mui/material";
import { GridCellParams, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { fetchPos } from "@/actions/InvoiceManagementActions";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 7);
export const initialPosSearch = {
  fromCreatedDate: new Date(
    previous.getTime() - previous.getTimezoneOffset() * 60000
  ).toISOString(),
  toCreatedDate: new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString(),
  posId: "",
  moneyAmount: 0,
};
export interface NEmpManagementDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
}
export const FilterBill = (props: NEmpManagementDrawerProps) => {
  const { isOpen, handleCloseDrawer } = props;

  const listOfFilterBills = useSelector(
    (state: RootState) => state.billManagement.filterBill
  );
  const sumOfBills = useSelector(
    (state: RootState) => state.billManagement.totalSumRow
  );
  const pagination = useSelector(
    (state: RootState) => state.billManagement.pagination
  );
  const isLoading = useSelector(
    (state: RootState) => state.billManagement.isLoading
  );
  const listOfPos = useSelector(
    (state: RootState) => state.invoiceManagement.posList
  );
  let result = [];
  if (listOfPos.length > 0) {
    result = listOfPos.map((item: any) => {
      return {
        values: item.code,
        key: item.id,
      };
    });
  } else {
    result = [];
  }
  const dispatch = useDispatch();

  const [searchCondition, setSearchCondition] = useState(initialPosSearch);
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        fromCreatedDate: new Date(previous),
        toCreatedDate: new Date(),
        entryCode: "",
        entryType: "",
        posId: {
          key: "",
          values: "",
        },
        moneyAmount: 0,
      },
    });
  // console.log("watch", watch());
  const handleSearch = () => {
    const {
      fromCreatedDate,
      toCreatedDate,
      entryCode,
      entryType,
      posId,
      moneyAmount,
    } = getValues();
    // console.log("fromCreatedDate",fromCreatedDate );
    // console.log("toCreatedDate",toCreatedDate );

    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);
    let arr: any[] = [];
    if (entryCode) {
      arr.push(entryCode);
    }
    const bodySend = {
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      posId: posId.key,
      moneyAmount: +moneyAmount,
    };
    dispatch(fetchFilterBills(bodySend));
    // dispatch(fetchSumBills(bodySend));
  };
  const onPageChange = (pageNumber: number) => {
    const searchPage = {
      ...searchCondition,
      page: pageNumber,
    };
    setSearchCondition(searchPage);
  };
  const onPageSizeChange = (pageSize: number) => {
    const searchPage = {
      ...searchCondition,
      pageSize: pageSize,
    };
    setSearchCondition(searchPage);
  };
  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      //   setSearchCondition(sortPage);
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  useEffect(() => {
    dispatch(fetchFilterBills(searchCondition));
  }, [searchCondition]);
  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  const columns: GridColDef<ColBillInfo>[] = useMemo(
    () => [
      {
        headerName: "Ngày tạo",
        field: "createdDate",
        width: 145,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          if (row.createdBy === "TOTAL") {
            return "";
          }
          return formatDateTime(row.createdDate);
        },
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <Box width={198} sx={{ padding: "12px 0px" }}>
                <DateRangePicker
                  setvalue={setValue}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 2,
                  }}
                >
                  <Button
                    onClick={handleSearch}
                    size="small"
                    style={{ width: 81 }}
                  >
                    xác nhận
                  </Button>
                </div>
              </Box>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "Mã bill",
        field: "code",
        width: 145,
        headerAlign: "center",
        align: "center",
        filterOperators: Operators({
          inputComponent: () => {
            return (
              <>
                <StyleFilterContainer>
                  <StyleTitleSearch>Giá trị</StyleTitleSearch>
                  <TextFieldCustom
                    type={"text"}
                    variantshow="standard"
                    textholder="Lọc giá trị"
                    focus={"true"}
                    {...register("entryType")}
                  />
                </StyleFilterContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 2,
                  }}
                >
                  <Button
                    onClick={handleSearch}
                    size="small"
                    style={{ width: 81 }}
                  >
                    xác nhận
                  </Button>
                </div>
              </>
            );
          },
          value: "input",
          label: "input",
        }),
      },
      {
        headerName: "POS",
        field: "posCode",
        width: 100,
        headerAlign: "center",
        align: "center",
        valueGetter: ({ row }) => {
          //   if (row.entryCode === "TOTAL") {
          //     return row.moneyAmount;
          //   }
          //   return row.entryCode;
          return row.posCode;
        },
        //     // cellClassName: (params: GridCellParams) => {
        //     //   if (params.row.entryCode !== "TOTAL") {
        //     //     return "";
        //     //   }
        //     //   return "super-app-theme--cell";
        //     // },
        //     // filterOperators: Operators({
        //     //   inputComponent: () => {
        //     //     return (
        //     //       <>
        //     //         <StyleFilterContainer>
        //     //           <StyleTitleSearch>Giá trị</StyleTitleSearch>
        //     //           <TextFieldCustom
        //     //             type={"text"}
        //     //             variantshow="standard"
        //     //             textholder="Lọc giá trị"
        //     //             focus={"true"}
        //     //             {...register("entryCode")}
        //     //           />
        //     //         </StyleFilterContainer>
        //     //         <div
        //     //           style={{
        //     //             display: "flex",
        //     //             flexDirection: "row",
        //     //             justifyContent: "flex-end",
        //     //             marginTop: 2,
        //     //           }}
        //     //         >
        //     //           <Button
        //     //             onClick={handleSearch}
        //     //             size="small"
        //     //             style={{ width: 81 }}
        //     //           >
        //     //             xác nhận
        //     //           </Button>
        //     //         </div>
        //     //       </>
        //     //     );
        //     //   },
        //     //   value: "input",
        //     //   label: "input",
        //     // }),
      },
      {
        headerName: "Tổng giao dịch ",
        field: "moneyAmount",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.createdBy !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        //     // valueGetter: ({ row }) => {
        //     //   if (row.transactionType === "INTAKE") {
        //     //     return row.moneyAmount;
        //     //   }
        //     //   if (row.entryCode === "TOTAL") {
        //     //     return row.intake;
        //     //   }
        //     //   return "";
        //     // },
      },
      {
        headerName: "Phí",
        field: "fee",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        // cellClassName: (params: GridCellParams) => {
        //   if (params.row.createdBy !== "TOTAL") {
        //     return "";
        //   }
        //   return "super-app-theme--cell";
        // },
        valueGetter: ({ row }) => {
          if (row.createdBy === "TOTAL") {
            return "";
          }
          return row.fee;
        },
      },
      {
        headerName: "Ước tính",
        field: "estimatedProfit",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.createdBy !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        // valueGetter: ({ row }) => {
        //   //   if (row.transactionType === "LOAN") {
        //   //     return row.moneyAmount;
        //   //   }
        //   //   if (row.entryCode === "TOTAL") {
        //   return row.pos.code;
        //   //   }
        //   //   return "";
        // },
      },

      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
        // field: "id",
        // checkboxSelection: true,
      },
    ],
    []
  );
  return (
    <DrawerCustom
      widthDrawer={750}
      isOpen={isOpen}
      title="Tạo bút toán"
      handleClose={handleCloseDrawer}
    >
      <form style={{ width: "100%" }} onSubmit={handleSubmit(handleSearch)}>
        <PageContent>
          <SearchContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Ngày tạo</LabelComponent>
                <DateRangePicker
                  setvalue={setValue}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                />
              </StyleInputContainer>

              <StyleInputContainer>
                <LabelComponent require={true}>Số tiền</LabelComponent>
                <TextFieldCustom
                  type={"text"}
                  iconend={<p style={{ width: 24 }}>VND</p>}
                  {...register("moneyAmount")}
                  onChange={(e: any) => {
                    setValue(
                      "moneyAmount",
                      e.target.value.trim().replaceAll(/[^0-9]/g, "")
                    );
                  }}
                />
                {/* <TextHelper>
                {errors.shipmentFee && errors.shipmentFee.message}
              </TextHelper> */}
              </StyleInputContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Mã Pos</LabelComponent>
                <SelectSearchComponent
                  control={control}
                  props={{
                    name: "posId",
                    placeHoder: "",
                    results: result,
                    label: "",
                    type: "text",
                    setValue: setValue,
                    labelWidth: "120",
                    getData: getDataFromApi,
                  }}
                />
                {/* <TextHelper>
                {errors.percentageFee && errors.percentageFee.message}
              </TextHelper> */}
              </StyleInputContainer>
              <StyleInputContainer style={{ justifyContent: "flex-end" }}>
                <Button variant="contained" size="small" type="submit">
                  Tìm kiếm
                </Button>
              </StyleInputContainer>
            </StyleContainer>
          </SearchContainer>
          <Box
            sx={{
              // height: 300,
              width: "100%",
              "& .super-app-theme--cell": {
                backgroundColor: "#EAEAEA",
                color: "#1a3e72",
                fontWeight: "600",
              },
            }}
          >
            <TableDataComponent
              columns={columns}
              dataInfo={listOfFilterBills}
              // itemFilter={itemFilter}
              onPageChange={onPageChange}
              handleSortModelChange={handleSortModelChange}
              loading={isLoading}
              isPage={true}
              getRowId={getRowId}
              checkboxSelection={true}
            />
          </Box>
        </PageContent>
      </form>
    </DrawerCustom>
  );
};

export default FilterBill;
const StyleTitleSearch = styled.p`
  font-size: 12px;
  font-weight: 400px;
  margin: 0.5px;
`;
const StyleFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3px 3px;
`;
const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
`;
