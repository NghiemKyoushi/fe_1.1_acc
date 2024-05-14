import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import styled from "styled-components";
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  GridRowModel,
  GridValidRowModel,
  GridValueGetterParams,
  GridValueSetterParams,
} from "@mui/x-data-grid";
import TableDataComponent from "@/components/common/DataGrid";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { useDispatch } from "react-redux";
import { fetchPos } from "@/actions/InvoiceManagementActions";
import { RootState } from "@/reducers/rootReducer";
import { useSelector } from "react-redux";
import { ROLE, cookieSetting, getValueWithComma } from "@/utils";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { fetchCardCustomer } from "@/actions/CardCustomerActions";
import {
  InfoCard,
  InvoiceCreate,
  ReceiptCreationParams,
  ValueFormCreate,
} from "@/models/InvoiceManagement";
import { enqueueSnackbar } from "notistack";
import {
  fetchBranch,
  fetchCreateInvoice,
  fetchSaveImage,
} from "@/api/service/invoiceManagement";
import { randomId } from "@mui/x-data-grid-generator";
import { InputNumber } from "@/components/common/InputCustom";
import ImageUpload from "@/components/common/ImageUpload";
import _ from "lodash";
import NewCardCustomer from "@/content/cardCustomer/Drawer/NewCardCustomer";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { branchType } from "@/models/PortManagementModel";
const initialRow = [
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
  {
    id: randomId(),
    pos: "",
    posId: "",
    money: "",
    typeOfCard: "",
    fee: "",
    feeafterpay: "",
    billcode: "",
  },
];
const initialRow2 = [
  {
    id: 1,
    intake: "",
    payout: "",
    loan: "",
    repayment: "",
  },
];
export interface InputPosProps<T extends FieldValues> {
  name: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  control: Control<T>;
  branchId?: string;
}
export const InputSearchPos = <T extends FieldValues>(
  props: InputPosProps<T>
) => {
  const dispatch = useDispatch();

  const { name, setValue, watch, control, branchId } = props;
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
  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value, branchId: branchId }));
  };
  return (
    <div>
      <SelectSearchComponent
        control={control}
        props={{
          name: name,
          placeHoder: "",
          results: result,
          label: "",
          type: "text",
          setValue: setValue,
          labelWidth: "120",
          getData: getDataFromApi,
          border: "true",
        }}
      />
    </div>
  );
};
export interface InvoiceDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  handleSearch: () => void;
}
export interface Item {
  id: string;
  pos: string;
  posId: string;
  money: string;
  typeOfCard: string;
  fee: string;
  feeafterpay: string;
  billcode: string;
}
export interface Item2 {
  id: number;
  intake: string; //thu
  payout: string; // chi
  loan: string; // công nợ
  repayment: string; // thu nợ
}

export interface TotalHeader {
  id: "Tổng";
  totalFee: number;
  totalAfterFee: number;
}

type Row = Item;

const InvoiceDrawer = (props: InvoiceDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch } = props;
  // const [rows, setRows] = useState<Row[]>(initialRow);
  const [rows2, setRows2] = useState<Item2[]>(initialRow2);
  const [imageId, setImageId] = useState("");
  const userName = cookieSetting.get("userName");
  const branchId = cookieSetting.get("branchId");
  const employeeId = cookieSetting.get("employeeId");
  const branchesCodeList = cookieSetting.get("branchesCodeList");

  const [isOpenCard, setIsOpenCard] = useState(false);
  const [infoCard, setInfoCard] = useState<InfoCard>({
    cardType: "",
    bank: "",
    accountNumber: "",
    prePaidFee: 0,
    prePaidFeeReceiverCode: "",
  });
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const cardCustomerList = useSelector(
    (state: RootState) => state.cardCustomer.cardCustomerList
  );
  const cardType = useSelector(
    (state: RootState) => state.cardCustomer.cardType
  );
  const [copyInvoice, setCopyInvoice] = useState<InvoiceCreate[]>([]);
  const [branchList, setBranchList] = useState<branchType[]>([]);
  const role = cookieSetting.get("roles");
  // [key: string]: string } |
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<ValueFormCreate>({
    defaultValues: {
      codeEmployee: "",
      customerInfo: "",
      customerName: {
        key: "",
        values: "",
        nationalId: "",
        percentageFee: "",
      },
      imageId: "",
      posSearch: "",
      percentageFee: "",
      shipmentFee: "",
      cardCustomer: {
        key: "",
        values: "",
      },
      totalBill: "",
      usingCardPrePayFee: false,
      acceptExceededFee: false,
      // note: "",
      branchIds: {
        key: "",
        values: "",
      },
      invoices: [
        {
          id: "",
          pos: {
            key: "",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: 0,
          billcode: "",
          check: "TOTAL",
        },
        {
          id: "",
          pos: {
            key: "",
            values: "",
          },
          posId: {
            key: "",
            values: "",
          },
          money: "",
          typeOfCard: "",
          fee: "",
          feeafterpay: 0,
          billcode: "",
          check: "",
        },
      ],
      invoicesCalculate: [
        {
          intake: 0, //thu
          payout: 0, // chi
          loan: 0, // công nợ
          repayment: 0,
        },
      ],
    },
  });
  const {
    fields: invoicesField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoices",
  });
  const { fields: invoicesCalculateField } = useFieldArray({
    control,
    name: "invoicesCalculate",
  } as never);
  const onAdd = () => {
    const item = {
      id: "",
      pos: {
        key: "",
        values: "",
      },
      posId: {
        key: "",
        values: "",
      },
      money: "",
      typeOfCard: "",
      fee: "",
      feeafterpay: 0,
      billcode: "",
      check: "",
      estimatedReturnFromBank: 0,
      returnFromBank: 0,
      calculatedProfit: "",
    };
    append(item);
  };
  useEffect(() => {
    let arr: InvoiceCreate[] = [];
    invoicesField.map((item) => {
      if (_.isNumber(item.feeafterpay)) {
        arr.push(item);
      }
    });
    setCopyInvoice(arr);
  }, [invoicesField]);
  const handleSubmitInvoice = () => {
    let receiptBills: any[] = [];
    if (watch("customerName").key === "") {
      enqueueSnackbar("Vui lòng chọn khách hàng", { variant: "warning" });
      return;
    }
    if (watch("cardCustomer").key === "") {
      enqueueSnackbar("Vui lòng chọn thẻ khách hàng", { variant: "warning" });
      return;
    }
    watch("invoices").map((item, index) => {
      if (item?.check !== "TOTAL" && item.posId.key !== "") {
        let restOfFee = 0;
        if (+item?.money) {
          const checkValue2 = +item?.money * (+watch("percentageFee") / 100);
          if (checkValue2 % 1000 !== 0) {
            restOfFee = Math.ceil(checkValue2 / 1000) * 1000;
          } else {
            restOfFee = +item?.money * (+watch("percentageFee") / 100);
          }
        }
        receiptBills.push({
          billId: "",
          posId: item?.posId?.key,
          moneyAmount: +item?.money,
          fee: restOfFee,
        });
      }
      return item;
    });
    if (receiptBills.length === 0) {
      enqueueSnackbar("Vui lòng nhập đầy đủ hóa đơn", { variant: "warning" });
      return;
    }
    const request: ReceiptCreationParams = {
      imageId: imageId,
      branchId: watch("branchIds").key,
      customerCardId: watch("cardCustomer").key,
      percentageFee: +watch("percentageFee"),
      shipmentFee: +watch("shipmentFee").replaceAll(",", ""),
      intake: watch("invoicesCalculate")[0].intake,
      payout: watch("invoicesCalculate")[0].payout,
      loan: watch("invoicesCalculate")[0].loan,
      repayment: watch("invoicesCalculate")[0].repayment,
      employeeId: employeeId,
      receiptBills: receiptBills,
      // note: watch("note"),
      usingCardPrePayFee: watch("usingCardPrePayFee"),
      acceptExceededFee:
        watch("usingCardPrePayFee") === true &&
        infoCard.prePaidFee < +watch("invoicesCalculate")[0].intake &&
        watch("acceptExceededFee") === true
          ? true
          : false,
    };
    fetchCreateInvoice(request)
      .then((res) => {
        enqueueSnackbar("Tạo hóa đơn thành công!!", { variant: "success" });
        handleSearch();
        handleCloseDrawer();
        const branch = {
          key: watch("branchIds").key,
          values: watch("branchIds").values,
        };
        setImageId("");
        reset();
        setValue("branchIds", branch);
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Tạo hóa đơn thất bại", { variant: "error" });
        }
      });
  };
  const handleOpenAddCard = () => {
    setIsOpenCard(true);
  };
  const handleCloseAddCard = () => {
    setIsOpenCard(false);
  };
  const handleGetFile = (file: Array<any>) => {
    if (!file || file[0].size > 5 * 1024 * 1024) {
      enqueueSnackbar("File ảnh phải nhỏ hơn 5MB", { variant: "error" });
      return;
    }
    fetchSaveImage(imageId, file[0])
      .then((res) => {
        setImageId(res.data);
      })
      .catch(function (error) {
        enqueueSnackbar("Load ảnh thất bại", { variant: "error" });
      });
  };
  const totalfee = watch("invoices").reduce((total, { money }) => {
    const calFee = +money * (+watch("percentageFee") / 100);
    if (calFee % 1000 !== 0) {
      return (total += +money - Math.ceil(calFee / 1000) * 1000);
    }
    return (total += +money - +money * (+watch("percentageFee") / 100));
  }, 0);
  const columns: GridColDef<InvoiceCreate>[] = useMemo(
    () => [
      {
        field: "id",
        width: 40,
        sortable: false,
        headerName: "STT",
        renderCell: (params: GridRenderCellParams<InvoiceCreate>) => {
          if (params.row.check && params.row.check === "TOTAL") {
            return "";
          }
          const index = params.api.getRowIndex(params.row.id);
          return +index;
        },
      },
      {
        headerName: "Mã Pos",
        field: "pos",
        width: 120,
        headerAlign: "left",
        sortable: false,
        // editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL" && !_.isNumber(params.row.check)) {
            return (
              <>
                <InputSearchPos
                  branchId={watch("branchIds").key}
                  control={control}
                  name={`invoices[${index}].posId`}
                  watch={watch}
                  setValue={setValue}
                />
              </>
            );
          }
          return <></>;
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Số tiền",
        field: "money",
        width: 130,
        sortable: false,
        editable: true,
        type: "number",
        headerAlign: "left",
        align: "left",
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        disableColumnFilter: true,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL") {
            return (
              <>
                <InputNumber
                  InputWidth="100%"
                  key={index}
                  name={`invoices.${index}.money`}
                  control={control}
                />
              </>
            );
          }
          let money = 0;
          money = watch("invoices").reduce(
            (total, { money }) => (total += +money),
            0
          );
          if (isNaN(money)) {
            return 0;
          }
          return getValueWithComma(money);
        },
      },
      {
        headerName: "Tiền phí",
        field: "fee",
        width: 130,
        sortable: false,
        editable: false,
        align: "left",
        type: "number",
        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce((total, { money }) => {
              const calFee = +money * (+watch("percentageFee") / 100);
              if (calFee % 1000 !== 0) {
                return (total += Math.ceil(calFee / 1000) * 1000);
              }
              return (total += +money * (+watch("percentageFee") / 100));
            }, 0);
            if (isNaN(fee)) {
              return 0;
            }
            return fee;
          }
          let restOfFee = 0;
          if (watch(`invoices.${index}.money`)) {
            const checkValue2 =
              +watch(`invoices.${index}.money`) *
              (+watch("percentageFee") / 100);
            if (checkValue2 % 1000 !== 0) {
              restOfFee = Math.ceil(checkValue2 / 1000) * 1000;
            } else {
              restOfFee =
                +watch(`invoices.${index}.money`) *
                (+watch("percentageFee") / 100);
            }
          }
          return getValueWithComma(restOfFee);
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Tiền sau phí",
        field: "feeafterpay",
        headerAlign: "left",
        width: 130,
        sortable: false,
        editable: false,
        align: "left",
        type: "number",
        valueGetter: (params: GridValueGetterParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce((total, { money }) => {
              const calFee = +money * (+watch("percentageFee") / 100);
              if (calFee % 1000 !== 0) {
                return (total += +money - Math.ceil(calFee / 1000) * 1000);
              }
              return (total +=
                +money - +money * (+watch("percentageFee") / 100));
            }, 0);

            if (isNaN(fee)) {
              return 0;
            }
            return fee;
          }
          let feeafterpay = 0;
          if (watch(`invoices.${index}.money`) !== undefined) {
            const checkValue2 =
              +watch(`invoices.${index}.money`) *
              (+watch("percentageFee") / 100);
            if (checkValue2 % 1000 !== 0) {
              feeafterpay =
                +watch(`invoices.${index}.money`) -
                Math.ceil(checkValue2 / 1000) * 1000;
            } else {
              feeafterpay =
                +watch(`invoices.${index}.money`) -
                +watch(`invoices.${index}.money`) *
                  (+watch("percentageFee") / 100);
            }
          }
          return  getValueWithComma(feeafterpay);
        },
        cellClassName: (params: GridCellParams<InvoiceCreate>) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        width: 120,
        sortable: false,
        align: "center",
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL") {
            return (
              <>
                <IconButton color="error" onClick={() => remove(index)}>
                  <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </>
            );
          }
          return <></>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoicesField]
  );

  const columnsOther: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Thu",
        field: "intake",
        width: 162,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.intake`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Chi",
        field: "payout",
        width: 162,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.payout`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Công nợ",
        field: "loan",
        width: 162,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.loan`}
                control={control}
              />
            </>
          );
        },
      },
      {
        headerName: "Thu nợ",
        field: "repayment",
        width: 164,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          return (
            <>
              <InputNumber
                InputWidth="100%"
                key={index}
                name={`invoicesCalculate.${index}.repayment`}
                control={control}
              />
            </>
          );
        },
      },
    ],
    []
  );
  const getRowId = (row: any) => {
    return row.id;
  };
  const dispatch = useDispatch();

  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
  useEffect(() => {
    if (watch("customerName")?.key) {
      setValue("percentageFee", watch("customerName").percentageFee);
      dispatch(fetchCardCustomer({ customerId: watch("customerName")?.key }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("customerName")]);

  useEffect(() => {
    if (watch("cardCustomer")?.key) {
      cardType.map((item: any) => {
        if (item.key === watch("cardCustomer")?.key) {
          setInfoCard({
            cardType: item.item?.cardType?.name,
            bank: item.item?.bank,
            accountNumber: item.item?.accountNumber,
            prePaidFee: item.item?.prePaidFee,
            prePaidFeeReceiverCode: item.item?.prePaidFeeReceiverCode,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("cardCustomer")]);
  useMemo(() => {
    if (branchesCodeList) {
      const sortBranch = JSON.parse(branchesCodeList).sort(
        (a: { orderId: number }, b: { orderId: number }) =>
          a.orderId - b.orderId
      );
      const branch = sortBranch.map(
        (item: { branch: { id: any; name: any } }) => {
          return {
            key: item?.branch.id,
            values: item?.branch.name,
          };
        }
      );
      setBranchList(branch);
      if (role === ROLE.EMPLOYEE) {
        sortBranch.map((item: { branch: { id: string; name: any } }) => {
          if (item?.branch.id === branchId) {
            setValue("branchIds", {
              key: item?.branch.id,
              values: item?.branch.name,
            });
          }
        });
      } else {
        setValue("branchIds", {
          key: sortBranch[0]?.branch.id,
          values: sortBranch[0]?.branch.name,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, branchesCodeList]);

  // useEffect(() => {
  //   fetchBranch().then((res) => {
  //     if (res.data) {
  //       const branch = res.data.map((item: any) => {
  //         return {
  //           values: item?.name,
  //           key: item?.id,
  //         };
  //       });
  //       setBranchList(branch);
  //     }
  //   });
  // }, []);
  const handleGetCard = () => {};

  const handleSearchCheck = () => {
    if (watch("customerName")?.key) {
      dispatch(fetchCardCustomer({ customerId: watch("customerName")?.key }));
    }
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={718}
        isOpen={isOpen}
        title="Tạo Hóa đơn"
        handleClose={() => {
          setValue("usingCardPrePayFee", false);
          handleCloseDrawer();
        }}
      >
        <form
          style={{ padding: 16 }}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit(handleSubmitInvoice)}
        >
          <PageContent>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Mã Nhân Viên</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    value={userName}
                    disable={"true"}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    iconend={<p style={{ width: 24 }}>%</p>}
                    {...register("percentageFee")}
                    onChange={(e: any) => {
                      setValue(
                        "percentageFee",
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      );
                    }}
                  />
                </StyleInputContainer>

                <StyleInputContainer>
                  <LabelComponent>Phí vận chuyển</LabelComponent>
                  <TextFieldCustom
                    iconend={<p style={{ width: 24 }}>VND</p>}
                    {...register("shipmentFee")}
                    onChange={(e: any) => {
                      setValue(
                        "shipmentFee",
                        getValueWithComma(
                          e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                        )
                      );
                    }}
                  />
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Chi nhánh</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "branchIds",
                      placeHoder: "",
                      results: branchList,
                      label: "",
                      disable: role === ROLE.EMPLOYEE && true,
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataCustomerFromApi,
                    }}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Tên Khách Hàng</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "customerName",
                      placeHoder: "",
                      results: listOfCustomer,
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: getDataCustomerFromApi,
                    }}
                  />
                </StyleInputContainer>

                <StyleInputContainer style={{ position: "relative" }}>
                  <LabelComponent require={true}>Tên Thẻ</LabelComponent>
                  <SelectSearchComponent
                    control={control}
                    props={{
                      name: "cardCustomer",
                      placeHoder: "",
                      results: cardType,
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: handleGetCard,
                    }}
                  />
                  <StyleButtonSpan>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenAddCard}
                    >
                      Thêm Thẻ
                    </Button>
                  </StyleButtonSpan>
                </StyleInputContainer>
                <InfoBankCard style={{ minWidth: 300 }}>
                  <InfoOutlinedIcon />
                  {infoCard && infoCard.cardType} - {infoCard && infoCard.bank}-{" "}
                  {infoCard && infoCard.accountNumber}{" "}
                  {infoCard.prePaidFee > 0 &&
                    `- Phí đã ứng:${getValueWithComma(
                      infoCard.prePaidFee
                    )} VND`}{" "}
                  {infoCard.prePaidFeeReceiverCode &&
                    `( ${infoCard.prePaidFeeReceiverCode} )`}
                </InfoBankCard>
              </StyleContainer>
            </SearchContainer>

            <StyleDataGrid>
              <Button variant="contained" size="small" onClick={onAdd}>
                Thêm bill
              </Button>
              <br />
              <Box
                sx={{
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
                  dataInfo={copyInvoice}
                  disableFilter={true}
                  isPage={true}
                  rowCount={100}
                  getRowId={getRowId}
                />
              </Box>
            </StyleDataGrid>
            <StyleDataGrid2>
              <label style={{ fontSize: 16, fontWeight: "bold" }}>
                Cân đối kế toán
              </label>
              <TableDataComponent
                columns={columnsOther}
                dataInfo={invoicesCalculateField}
                disableFilter={true}
                isPage={true}
                rowCount={100}
                getRowId={getRowId}
              />
              <div
                style={{
                  display: "flex",
                  // gridTemplateColumns: "repeat(2, 1fr)",
                  flexDirection: "column",
                  marginTop: -30,
                }}
              >
                <StyleCheckBoxTex>
                  <Controller
                    name="usingCardPrePayFee"
                    control={control}
                    render={({ field }) => <Checkbox {...field} />}
                  />
                  <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                    Sử dụng phí đã ứng của thẻ
                  </Typography>
                </StyleCheckBoxTex>
                <StyleCheckBoxTex>
                  <Controller
                    name="acceptExceededFee"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        disabled={
                          watch("usingCardPrePayFee") === true &&
                          infoCard.prePaidFee <=
                            +watch("invoicesCalculate")[0].intake
                            ? false
                            : true
                        }
                        {...field}
                      />
                    )}
                  />
                  <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                    Xác nhận thu đủ phần thiếu của phí đã ứng
                  </Typography>
                </StyleCheckBoxTex>
              </div>
              {/* <div style={{ width: "60%" }}>
                <Typography style={{ fontWeight: "bold" }}>Ghi chú</Typography>
                <TextareaComponent
                  control={control}
                  valueInput={""}
                  name={"note"}
                  label={"Ghi chú"}
                  width={"100"}
                  type={""}
                  disable={false}
                />
              </div> */}
            </StyleDataGrid2>
            <ContainerSum>
              <StyleInputContainer>
                <label style={{ fontSize: 17, fontWeight: "bold" }}>
                  TỔNG TIỀN SAU PHÍ
                </label>
                <TextFieldCustom
                  type={"text"}
                  disable="true"
                  value={
                    _.isNumber(totalfee)
                      ? getValueWithComma(
                          +totalfee - +watch("shipmentFee").replace(/,/g, "")
                        ).toString()
                      : "0"
                  }
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <ImageUpload handleGetFile={handleGetFile} filePath="" />
              </StyleInputContainer>
            </ContainerSum>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                marginTop: 3,
                padding: "0px 16px 8px 16px",
              }}
            >
              <Button size="small" variant="contained" type="submit">
                Lưu Hóa Đơn
              </Button>
            </Box>
          </PageContent>
        </form>
        <NewCardCustomer
          isOpen={isOpenCard}
          handleCloseDrawer={handleCloseAddCard}
          handleSearch={handleSearchCheck}
        />
      </DrawerCustom>
    </>
  );
};
export default InvoiceDrawer;

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const ContainerSum = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 16px;
  margin-top: -50px;
`;
const InfoBankCard = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #0068a3;
  color: #0068a3;
  border-radius: 10px;
  padding: 10px;
  background-color: #d6f0ff;
`;
const StyleDataGrid = styled.div`
  width: 683px;
  padding: 0px 16px;
`;
const StyleDataGrid2 = styled.div`
  margin-top: -15px;
  width: 683px;
  padding: 0px 16px;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const StyleCheckBoxTex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const StyleButtonSpan = styled.span`
  position: absolute;
  top: 32px;
  right: -21%;
`;
const TextHelper = styled.span`
  color: red;
  font-size: 12px;
`;
