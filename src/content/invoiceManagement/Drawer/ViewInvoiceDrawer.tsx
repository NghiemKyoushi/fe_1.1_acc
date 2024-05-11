import SelectSearchComponent from "@/components/common/AutoComplete";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  InfoCard,
  ReceiptCreationParams,
  ValueFormCreate,
} from "@/models/InvoiceManagement";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import {
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { InputSearchPos } from "./InvoiceDrawer";
import { InputNumber } from "@/components/common/InputCustom";
import { ROLE, cookieSetting, getValueWithComma } from "@/utils";
import { enqueueSnackbar } from "notistack";
import {
  fetchBranch,
  fetchImagePath,
  fetchSaveImage,
  updateInvoice,
} from "@/api/service/invoiceManagement";
import ImageUpload from "@/components/common/ImageUpload";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NewCardCustomer from "@/content/cardCustomer/Drawer/NewCardCustomer";
import _ from "lodash";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import { branchType } from "@/models/PortManagementModel";
import { fetchSearchCustomer } from "@/actions/CustomerManagerAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchCardCustomer } from "@/actions/CardCustomerActions";

export interface ViewInvoiceDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
  handleSearch: () => void;
}
export const ViewInvoiceDrawer = (props: ViewInvoiceDrawerProps) => {
  const { isOpen, handleCloseDrawer, rowInfo, handleSearch } = props;
  const branchId = cookieSetting.get("branchId");
  const [imageId, setImageId] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [branchList, setBranchList] = useState<branchType[]>([]);

  const branchesCodeList = cookieSetting.get("branchesCodeList");

  const [infoCard, setInfoCard] = useState<InfoCard>({
    cardType: "",
    bank: "",
    accountNumber: "",
    prePaidFee: 0,
    prePaidFeeReceiverCode: "",
  });
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
      check: "",
      usingCardPrePayFee: false,
      invoicesCalculate: [
        {
          intake: 0, //thu
          payout: 0, // chi
          loan: 0, // công nợ
          repayment: 0,
        },
      ],
      invoices: [],
      codeEmployee: "",
      customerInfo: "",
      customerName: {
        key: "",
        values: "",
        nationalId: "",
      },
      // image_Id: "",
      posSearch: "",
      percentageFee: "",
      shipmentFee: "",
      cardCustomer: {
        key: "",
        values: "",
      },
      totalBill: "",
    },
  });
  const role = cookieSetting.get("roles");
  const listOfCustomer = useSelector(
    (state: RootState) => state.customerManagament.customerList
  );
  const cardType = useSelector(
    (state: RootState) => state.cardCustomer.cardType
  );
  const { fields: invoicesCalculateField } = useFieldArray({
    control,
    name: "invoicesCalculate",
  } as never);
  const handleGetFile = (file: any) => {
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
  const getPathImage = async (id: string) => {
    const getFile = await fetchImagePath(id);
    return getFile;
  };
  const handleOpenAddCard = () => {
    setIsOpenCard(true);
  };
  const handleCloseAddCard = () => {
    setIsOpenCard(false);
  };
  useEffect(() => {
    if (rowInfo) {
      if (rowInfo?.imageId !== "") {
        setImageId(rowInfo.imageId);
        getPathImage(rowInfo.imageId).then((res) => {
          URL.createObjectURL(res.data);
          setImagePath(URL.createObjectURL(res.data));
        });
      }

      let dataTable: any[] = [];
      let invoicesCalculate = [
        {
          intake: rowInfo.intake, //thu
          payout: rowInfo.payout, // chi
          loan: rowInfo.loan, // công nợ
          repayment: rowInfo.repayment,
        },
      ];
      if (rowInfo.bills.length > 0) {
        rowInfo.bills.map((item: any) => {
          dataTable.push({
            ...item,
            money: item.moneyAmount,
            calculatedProfit: item.calculatedProfit,
            returnFromBank: item.returnFromBank,
            posId: {
              values: item.pos.code,
              key: item.pos.id,
            },
            check: "",
          });
        });
        dataTable.unshift({
          posId: {
            values: "",
            key: "",
          },
          id: "",
          money: "",
          fee: "",
          check: "TOTAL",
          calculatedProfit: "",
          returnFromBank: 0,
        });
      }
      reset({
        codeEmployee: rowInfo?.employee.name,
        percentageFee: rowInfo?.percentageFee,
        shipmentFee: getValueWithComma(rowInfo?.shipmentFee),
        customerName: {
          key: rowInfo?.customerCard.customer?.id,
          values: rowInfo?.customerCard.customer.name,
          nationalId: "",
        },
        cardCustomer: {
          key: rowInfo?.customerCard.id,
          values:
            rowInfo?.customerCard.name.toString() +
            " - " +
            rowInfo?.customerCard.accountNumber.toString().slice(-4),
        },
        invoices: [...dataTable],
        invoicesCalculate: invoicesCalculate,
        // note: rowInfo?.note,
        usingCardPrePayFee: rowInfo.usingCardPrePayFee,
        acceptExceededFee: rowInfo.acceptExceededFee,
        branchIds: {
          key: rowInfo.branch.id,
          values: rowInfo.branch.name,
        },
      });
      setInfoCard({
        cardType: rowInfo.customerCard.cardType?.name,
        bank: rowInfo.customerCard.bank,
        accountNumber: rowInfo.customerCard.accountNumber,
        prePaidFee: rowInfo.customerCard.prePaidFee,
        prePaidFeeReceiverCode: rowInfo.customerCard.prePaidFeeReceiverCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);
  useEffect(() => {
    if (!isOpen) {
      setImagePath("");
      setImageId("");
      setValue("invoices", [
        // {
        //   posId: {
        //     values: "",
        //     key: "",
        //   },
        //   id: "",
        //   money: "",
        //   fee: "",
        //   check: "TOTAL",
        //   calculatedProfit: "",
        //   returnFromBank: 0,
        // },
      ]);
    }
  }, [isOpen]);
  const {
    fields: invoicesField,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "invoices",
  });
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
      estimatedReturnFromBank: 0,
      returnFromBank: 0,
      check: "",
    };
    append(item);
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        width: 20,
        sortable: false,
        headerName: "STT",
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.check === "TOTAL") {
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
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        // editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL") {
            return (
              <InputSearchPos
                control={control}
                name={`invoices.${index}.posId`}
                watch={watch}
                setValue={setValue}
              />
            );
          }
          return <p></p>;
        },
      },
      {
        headerName: "Số tiền",
        field: "money",
        width: 120,
        sortable: false,
        // editable: true,
        type: "number",
        headerAlign: "left",
        align: "left",
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
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
        width: 120,
        headerAlign: "left",
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
        cellClassName: (params: GridCellParams) => {
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
        width: 120,
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
          return feeafterpay;
        },
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
      },
      {
        headerName: "Tiền về",
        field: "returnFromBank ",
        width: 120,
        headerAlign: "left",
        sortable: false,
        cellClassName: (params: GridCellParams) => {
          if (params.row.check !== "TOTAL") {
            return "";
          }
          return "super-app-theme--cell";
        },
        // editable: true,
        valueGetter: ({ row }) => {
          if (row.check === "TOTAL") {
            let fee = 0;
            fee = watch("invoices").reduce((total, { returnFromBank }) => {
              return (total += +returnFromBank);
            }, 0);
            return getValueWithComma(fee);
          }
          if (row.returnFromBank) {
            return getValueWithComma(row.returnFromBank);
          }
        },
        // renderCell: (params: GridRenderCellParams) => {
        //   const check = getValueWithComma(params.value);
        //   return <p>{check}</p>;
        // },
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        width: 120,
        sortable: false,
        align: "center",
        renderCell: (params: GridRenderCellParams) => {
          const index = params.api.getRowIndex(params.row.id);
          if (params.row.check !== "TOTAL" && params.row?.code === null) {
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
    []
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
        width: 162,
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
  const handleSubmitInvoice = () => {
    let receiptBills: any[] = [];
    watch("invoices").map((item, index) => {
      if (item?.check !== "TOTAL" && item?.posId?.key !== "") {
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
      enqueueSnackbar("Vui lòng nhập hóa đơn", { variant: "warning" });
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
      employeeId: rowInfo.employee.id,
      receiptBills: receiptBills,
      // note: watch("note"),
      usingCardPrePayFee: watch("usingCardPrePayFee"),
      acceptExceededFee:
        watch("usingCardPrePayFee") === true &&
        rowInfo.customerCard.prePaidFee <
          +watch("invoicesCalculate")[0].intake &&
        watch("acceptExceededFee") === true
          ? true
          : false,
    };
    updateInvoice(rowInfo.id, request)
      .then((res) => {
        enqueueSnackbar("Cập nhật hóa đơn thành công!!", {
          variant: "success",
        });
        reset();
        setImagePath("");
        setImageId("");
        handleCloseDrawer();
        handleSearch();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Dữ liệu không hợp lệ", { variant: "error" });
        }
      });
  };
  const dispatch = useDispatch();

  const getDataCustomerFromApi = (value: string) => {
    if (value !== "") {
      dispatch(fetchSearchCustomer({ customerName: value }));
    }
  };
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
  useEffect(() => {
    if (watch("customerName")?.key) {
      dispatch(fetchCardCustomer({ customerId: watch("customerName")?.key }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("customerName")]);

  const getRowId = (row: any) => {
    return row.id;
  };
  const totalfee = watch("invoices").reduce((total, { money }) => {
    const calFee = +money * (+watch("percentageFee") / 100);
    if (calFee % 1000 !== 0) {
      return (total += +money - Math.ceil(calFee / 1000) * 1000);
    }
    return (total += +money - +money * (+watch("percentageFee") / 100));
  }, 0);
  const handleGetCard = () => {};
  const handleSearchCheck = () => {};

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  useMemo(() => {
    if (role !== ROLE.ADMIN) {
      branchList.map((item) => {
        if (item?.key === branchId) {
          setValue("branchIds", {
            key: item.key,
            values: item?.values,
          });
        }
      });
    } else {
      setValue("branchIds", {
        key: branchList[0]?.key,
        values: branchList[0]?.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, branchList]);

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
  return (
    <DrawerCustom
      widthDrawer={750}
      isOpen={isOpen}
      title="Thông tin hóa đơn"
      handleClose={handleCloseDrawer}
    >
      {rowInfo && (
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
                    {...register("codeEmployee")}
                    disable={"true"}
                  />
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    iconend={<p style={{ width: 24 }}>%</p>}
                    {...register(
                      "percentageFee"
                      // , {
                      //   required: "Phần trăm phí bắt buộc",
                      // }
                    )}
                    onChange={(e: any) => {
                      setValue(
                        "percentageFee",
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      );
                    }}
                  />
                  {/* <TextHelper>
                    {errors.percentageFee && errors.percentageFee.message}
                  </TextHelper> */}
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
                      results: rowInfo?.code === null ? listOfCustomer : [],
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
                      results: rowInfo?.code === null ? cardType : [],
                      label: "",
                      type: "text",
                      setValue: setValue,
                      labelWidth: "100",
                      getData: handleGetCard,
                    }}
                  />
                  {rowInfo?.code === null && (
                    <StyleButtonSpan>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleOpenAddCard}
                      >
                        Thêm Thẻ
                      </Button>
                    </StyleButtonSpan>
                  )}
                </StyleInputContainer>
                <InfoBankCard>
                  <InfoOutlinedIcon />
                  {infoCard && infoCard.cardType} - {infoCard && infoCard.bank}-{" "}
                  {infoCard && infoCard.accountNumber}{" "}
                  {infoCard.prePaidFee > 0 &&
                    `- Phí đã ứng: ${getValueWithComma(
                      infoCard.prePaidFee
                    )} VND`}{" "}
                  {infoCard.prePaidFeeReceiverCode &&
                    `( ${infoCard.prePaidFeeReceiverCode} )`}
                </InfoBankCard>
              </StyleContainer>
            </SearchContainer>

            <StyleDataGrid>
              {rowInfo?.code === null && (
                <Button variant="contained" size="small" onClick={onAdd}>
                  Thêm bill
                </Button>
              )}

              <br />
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
                {isOpen && (
                  <TableDataComponent
                    columns={columns}
                    dataInfo={invoicesField}
                    disableFilter={true}
                    isPage={true}
                    rowCount={100}
                    getRowId={getRowId}
                  />
                )}
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
                    control={control}
                    name={`usingCardPrePayFee`}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox checked={value} onChange={onChange} />
                    )}
                  />

                  <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                    Sử dụng phí đã ứng của thẻ
                  </Typography>
                </StyleCheckBoxTex>
                <StyleCheckBoxTex>
                  <Controller
                    name="acceptExceededFee"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        disabled={
                          watch("usingCardPrePayFee") === true &&
                          rowInfo.customerCard.prePaidFee <
                            +watch("invoicesCalculate")[0].intake
                            ? false
                            : true
                        }
                        checked={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  <Typography sx={{ fontStyle: "italic", fontSize: 14 }}>
                    Xác nhận thu đủ phần thiếu của phí đã ứng
                  </Typography>
                </StyleCheckBoxTex>
              </div>
              {/* <div style={{ width: "60%" }}>
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
                          +totalfee -
                            +watch("shipmentFee").toString().replace(/,/g, "")
                        ).toString()
                      : "0"
                  }
                />
              </StyleInputContainer>
              <StyleInputContainer>
                <ImageUpload
                  handleGetFile={handleGetFile}
                  filePath={imagePath}
                />
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
              {rowInfo?.code === null && (
                <Button size="small" variant="contained" type="submit">
                  Cập nhật
                </Button>
              )}
            </Box>
          </PageContent>
        </form>
      )}
      <NewCardCustomer
        isOpen={isOpenCard}
        handleCloseDrawer={handleCloseAddCard}
        handleSearch={handleSearchCheck}
      />
    </DrawerCustom>
  );
};

export default ViewInvoiceDrawer;
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
  margin-top: -30px;
`;
const InfoBankCard = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #0068a3;
  color: #0068a3;
  border-radius: 10px;
  padding: 10px;
  background-color: #d6f0ff;
  min-width: 18.75rem;
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
const StyleButtonSpan = styled.span`
  position: absolute;
  top: 32px;
  right: -20%;
`;
const StyleCheckBoxTex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
