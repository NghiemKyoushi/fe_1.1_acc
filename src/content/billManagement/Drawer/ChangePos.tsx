import {
  fetchFilterBills,
  fetchFilterBillsPosFee,
} from "@/actions/BillManagementActions";
import TableDataComponent, { Operators } from "@/components/common/DataGrid";
import { DateRangePicker } from "@/components/common/DatePickerComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { ColBillInfo, ColFilterBill } from "@/models/BillManagementModel";
import { RootState } from "@/reducers/rootReducer";
import { formatDateTime, getValueWithComma, handleKeyPress } from "@/utils";
import { Box, Button } from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRowParams,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
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
import { enqueueSnackbar } from "notistack";
import { fetchUpdatePosFee } from "@/api/service/billManagement";
import _ from "lodash";

const date = new Date();
const previous = new Date(date.getTime());
previous.setDate(date.getDate() - 30);
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
  handleSearchGeneral: () => void;
}
export const ChangePosFee = (props: NEmpManagementDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearchGeneral } = props;
  const [listOfSelection, setListOfSelection] = useState<
    Array<string | number>
  >([]);
  const [sumBill, setSumBill] = useState<ColFilterBill>();

  const [imageId, setImageId] = useState("");
  const [listOfBills, setListOfBills] = useState<ColFilterBill[]>([]);

  const listOfFilterBills = useSelector(
    (state: RootState) => state.billManagement.filterBillPosFee
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
        moneyAmount: "",
        explanation: "",
      },
    });
  const handleSearch = () => {
    const { fromCreatedDate, toCreatedDate, posId } = getValues();
    const fromDate = new Date(fromCreatedDate);
    const toDate = new Date(toCreatedDate);
    let arr: any[] = [];
    const bodySend = {
      fromCreatedDate: fromDate.toISOString(),
      toCreatedDate: toDate.toISOString(),
      posId: posId.key,
    };
    dispatch(fetchFilterBillsPosFee(bodySend));
  };
  const handleSortModelChange = (sortModel: GridSortModel) => {
    if (sortModel[0]) {
      const sortPage = {
        ...searchCondition,
        sorter: sortModel[0].field,
        sortDirection: sortModel[0]?.sort?.toString().toUpperCase(),
      };
      dispatch(fetchFilterBills(sortPage));
    }
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  useEffect(() => {
    if (listOfFilterBills.length > 0) {
      let countSum = 0;
      let estimateBill = 0;
      listOfFilterBills.map((item: ColFilterBill) => {
        countSum = countSum + item.moneyAmount;
        estimateBill = estimateBill + item.estimatedReturnFromBank;
      });
      const sumBill: ColFilterBill = {
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        recordStatusEnum: "",
        id: "12233",
        code: "TOTAL",
        timeStampSeq: 0,
        moneyAmount: countSum,
        fee: 0,
        returnedProfit: 0,
        returnedTime: "0",
        estimatedReturnFromBank: estimateBill,
      };
      setSumBill(sumBill);
      setListOfBills([sumBill, ...listOfFilterBills]);
    } else {
      setListOfBills([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfFilterBills]);

  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  const handleGetListOfSelect = (value: Array<string | number>) => {
    let totalTrading = 0;
    let totalEstimateReturnFromBank = 0;
    if (value.length > 0) {
      listOfBills.map((row) => {
        value.map((select) => {
          if (row.id === select) {
            totalTrading += row.moneyAmount;
            totalEstimateReturnFromBank += row.estimatedReturnFromBank;
          }
        });
      });
    }
    const shadowData: ColFilterBill[] = listOfBills.map((row) => {
      if (row.code === "TOTAL") {
        return {
          ...row,
          moneyAmount:
            value.length > 0
              ? totalTrading
              : sumBill?.moneyAmount
              ? sumBill?.moneyAmount
              : 0,
          estimatedReturnFromBank:
            value.length > 0
              ? totalEstimateReturnFromBank
              : sumBill?.estimatedReturnFromBank
              ? sumBill?.estimatedReturnFromBank
              : 0,
        };
      }
      return row;
    });
    setListOfBills([...shadowData]);
    setListOfSelection(value);
  };
  const handleConfirmChangePosFee = () => {
    // const { explanation } = getValues();
    if (listOfSelection.length < 1) {
      enqueueSnackbar("Vui lòng chọn bill thay đổi phí Pos", {
        variant: "warning",
      });
      return;
    }
    if (watch("moneyAmount") === "") {
      enqueueSnackbar("Vui lòng nhập phần trăm Pos", {
        variant: "warning",
      });
      return;
    }
    if (
      watch("moneyAmount") !== "" &&
      _.toNumber(watch("moneyAmount").toString().replaceAll(",", "")) > 100
    ) {
      enqueueSnackbar("Phần trăm phí nhỏ hơn hoặc bằng 100", {
        variant: "warning",
      });
      return;
    }
    const bodySend = {
      billIds: listOfSelection,
      posFeeStamp: _.toNumber(
        watch("moneyAmount").toString().replaceAll(",", "")
      ),
    };
    fetchUpdatePosFee(bodySend)
      .then((res) => {
        enqueueSnackbar("Thay đổi phần trăm Pos thành công", {
          variant: "success",
        });
        handleSearch();
        handleSearchGeneral();
        setListOfSelection([]);
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Thay đổi phần trăm Pos", { variant: "error" });
        }
      });
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
          if (row.code === "TOTAL") {
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
                  fromdateValue={watch("fromCreatedDate")}
                  todateValue={watch("toCreatedDate")}
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
        valueGetter: ({ row }) => {
          if (row.code === "TOTAL") {
            return "";
          }
          //   return row.entryCode;
          return row.code;
        },
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
          return row.pos?.code;
        },
      },
      {
        headerName: "Tổng giao dịch",
        field: "moneyAmount",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(params.value);
        },
      },
      {
        headerName: "Dự tính tiền ngân hàng",
        field: "estimatedReturnFromBank",
        width: 180,
        headerAlign: "center",
        align: "center",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.code !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        valueGetter: (params: GridValueGetterParams) => {
          return getValueWithComma(+params.value);
        },
      },
      {
        headerName: "Phí",
        field: "fee",
        width: 145,
        headerAlign: "center",
        align: "center",
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => {
          if (params.row.code === "TOTAL") {
            return "";
          }
          return getValueWithComma(params.row.fee);
        },
      },
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
        // field: "id",
        // checkboxSelection: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listOfBills]
  );
  return (
    <DrawerCustom
      widthDrawer={850}
      isOpen={isOpen}
      title="Tạo bút toán"
      handleClose={handleCloseDrawer}
    >
      <form
        onKeyPress={handleKeyPress}
        style={{ width: "100%" }}
        onSubmit={handleSubmit(handleSearch)}
      >
        <PageContent>
          <SearchContainer>
            <StyleContainer>
              <StyleInputContainer>
                <LabelComponent require={true}>Ngày tạo</LabelComponent>
                <DateRangePicker
                  setvalue={setValue}
                  fromdatename={"fromCreatedDate"}
                  todatename={"toCreatedDate"}
                  fromdateValue={watch("fromCreatedDate")}
                  todateValue={watch("toCreatedDate")}
                />
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
              </StyleInputContainer>

              <StyleInputContainer style={{ justifyContent: "flex-end" }}>
                <Button variant="contained" size="small" type="submit">
                  Tìm kiếm
                </Button>
              </StyleInputContainer>
            </StyleContainer>
          </SearchContainer>
          <StyleInputContainer style={{ width: "26%" }}>
            <LabelComponent>Phí Pos</LabelComponent>
            <TextFieldCustom
              type={"text"}
              iconend={<p style={{ width: 18 }}>%</p>}
              {...register("moneyAmount")}
              onChange={(e: any) => {
                setValue(
                  "moneyAmount",
                  getValueWithComma(
                    e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                  )
                );
              }}
            />
          </StyleInputContainer>
          <Box
            sx={{
              // height: 300,
              width: "100%",
              "& .super-app-theme--cell": {
                backgroundColor: "#EAEAEA",
                color: "#1a3e72",
                fontWeight: "600",
                justifyContent: "flex-end !important",
              },
            }}
          >
            <TableDataComponent
              columns={columns}
              dataInfo={listOfBills}
              rowCount={100}
              handleSortModelChange={handleSortModelChange}
              loading={isLoading}
              isPage={true}
              getRowId={getRowId}
              checkboxSelection={true}
              selectionModel={listOfSelection}
              handleGetListOfSelect={handleGetListOfSelect}
              isRowSelectable={(params: GridRowParams) => {
                if (
                  params.row.returnedTime !== null ||
                  params.row.createdBy === "TOTAL"
                ) {
                  return false;
                }
                return true;
              }}
            />
          </Box>
          <Box
            sx={{
              justifyContent: "flex-end",
              display: "flex",
              marginTop: 3,
              padding: "0px 16px 8px 16px",
            }}
          >
            <Button
              size="small"
              variant="contained"
              type="submit"
              onClick={handleConfirmChangePosFee}
            >
              Thay đổi phí Pos
            </Button>
          </Box>
        </PageContent>
      </form>
    </DrawerCustom>
  );
};

export default ChangePosFee;
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
