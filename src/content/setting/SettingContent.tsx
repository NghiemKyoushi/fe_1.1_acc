import Dashboard from "@/components/Layout";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Button, IconButton } from "@mui/material";
import TableDataComponent from "@/components/common/DataGrid";
import { useDispatch } from "react-redux";
import { fetchAccEntryType } from "@/actions/AccEntryTypeActions";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchAllCard } from "@/actions/CardCustomerActions";
import { AddEntryTypeDialogComponent } from "./Dialog/AddEntryTypeDialog";
import { useForm } from "react-hook-form";
import {
  createAccEntryList,
  deleteAccEntry,
  updateAccEntryList,
} from "@/api/service/accEntryType";
import { enqueueSnackbar } from "notistack";
import { DialogDeleteComponent } from "@/components/dialogDelete/DialogDelete";
import {
  createCardType,
  deleteCardType,
  updateCardType,
} from "@/api/service/cardCustomerApis";
import { AddCardTypeDialogComponent } from "./Dialog/AddCardTypesDialog";

export const SettingContent = () => {
  const [accEntry, setAccEntry] = useState([]);
  const [openDialogEntry, setOpenDialogEntry] = useState(false);
  const [openDialogCardType, setOpenDialogCardType] = useState(false);

  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [isDeleteFormCardType, setIsDeleteFormCardtype] = useState(false);

  const [entryId, setEntryId] = useState("");
  const [cardTypeId, setCardTypeId] = useState("");

  const [typeEntryModal, setTypeEntryModal] = useState("");
  const [typeCardTypeModal, setCardTypeModal] = useState("");

  const accEntryType = useSelector(
    (state: RootState) => state.accEntryType.accEntryTypeList
  );
  const listOfCard = useSelector(
    (state: RootState) => state.cardCustomer.cardList
  );
  const { register, handleSubmit, getValues, setValue, watch, reset, control } =
    useForm({
      defaultValues: {
        accEntryType: "",
        transactionType: {
          key: "",
          values: "",
        },
        cardType: "",
      },
    });
  const handleCloseEntryType = () => {
    setOpenDialogEntry(false);
    setValue("accEntryType", "");
  };
  const handleOpenEntryType = (type: string) => {
    setTypeEntryModal(type);
    setOpenDialogEntry(true);
  };
  const handleConfirmCreateEntry = () => {
    const { accEntryType, transactionType } = getValues();

    if (typeEntryModal === "CREATE" && accEntryType !== "") {
      const bodySend = {
        title: accEntryType,
        transactionType: transactionType.key,
      };
      createAccEntryList(bodySend)
        .then((res) => {
          enqueueSnackbar("Tạo định khoản thành công", { variant: "success" });
          handleCloseEntryType();
          reset();
          dispatch(fetchAccEntryType());
        })
        .catch(function (error: any) {
          enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
        });
    } else if (typeEntryModal === "UPDATE" && accEntryType !== "") {
      const bodySend = {
        id: entryId,
        title: accEntryType,
      };
      updateAccEntryList(bodySend)
        .then((res) => {
          enqueueSnackbar("Cập nhật thành công", { variant: "success" });
          handleCloseEntryType();
          reset();
          dispatch(fetchAccEntryType());
        })
        .catch(function (error: any) {
          enqueueSnackbar("Cập nhật thất bại", { variant: "error" });
        });
    }
  };

  const handleOpenEditEntryType = (row: any, type: string) => {
    setTypeEntryModal(type);
    setEntryId(row.id);
    setValue("accEntryType", row.values);
    setOpenDialogEntry(true);
  };
  const handleCloseDeleteForm = () => {
    setIsDeleteForm(false);
    setEntryId("");
  };
  const handleOpenDeleteForm = (id: string) => {
    setEntryId(id);
    setIsDeleteForm(true);
  };
  const handleConfirmDeleteForm = () => {
    deleteAccEntry(entryId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        dispatch(fetchAccEntryType());
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
  // cardType function
  const handleCloseCardType = () => {
    setOpenDialogCardType(false);
    setValue("cardType", "");
  };
  const handleOpenCardType = (type: string) => {
    setCardTypeModal(type);
    setOpenDialogCardType(true);
  };
  const handleConfirmCardType = () => {
    const { cardType } = getValues();
    if (typeCardTypeModal === "CREATE" && cardType !== "") {
      createCardType(cardType)
        .then((res) => {
          enqueueSnackbar("Tạo loại thẻ thành công", { variant: "success" });
          handleCloseCardType();
          reset();
          dispatch(fetchAllCard());
        })
        .catch(function (error: any) {
          enqueueSnackbar("Xác nhận thất bại", { variant: "error" });
        });
    } else if (typeCardTypeModal === "UPDATE" && cardType !== "") {
      updateCardType(cardType, cardTypeId)
        .then((res) => {
          enqueueSnackbar("Cập nhật thành công", { variant: "success" });
          handleCloseCardType();
          reset();
          dispatch(fetchAllCard());
        })
        .catch(function (error: any) {
          enqueueSnackbar("Cập nhật thất bại", { variant: "error" });
        });
    }
  };
  const handleOpenCardtype = (row: any, type: string) => {
    setCardTypeModal(type);
    setCardTypeId(row.id);
    setValue("cardType", row.values);
    setOpenDialogCardType(true);
  };
  const handleCloseDeleteCardType = () => {
    setIsDeleteFormCardtype(false);
    setCardTypeId("");
  };
  const handleOpenDeleteCardType = (id: string) => {
    setCardTypeId(id);
    setIsDeleteFormCardtype(true);
  };
  const handleConfirmDeleteCardType = () => {
    deleteCardType(cardTypeId)
      .then((res) => {
        enqueueSnackbar("Xóa thành công!!", { variant: "success" });
        handleCloseDeleteForm();
        dispatch(fetchAccEntryType());
      })
      .catch(function (error: any) {
        enqueueSnackbar("Xóa thất bại", { variant: "error" });
      });
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccEntryType());
    dispatch(fetchAllCard());
  }, []);
  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Định khoản",
        field: "values",
        width: 190,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
      },
      {
        headerName: "Phân loại",
        field: "transactionType",
        width: 186,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 200,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton
                color="error"
                onClick={() => handleOpenDeleteForm(row.id)}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          );
        },
      },
    ],
    []
  );
  const columnsCardType: GridColDef[] = useMemo(
    () => [
      {
        headerName: "Loại thẻ",
        field: "values",
        width: 250,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
      },
      {
        headerName: "Thao Tác",
        field: "actions",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 230,
        renderCell: ({ row }) => {
          return (
            <>
              <IconButton color="info">
                <EditOutlinedIcon
                  sx={{ fontSize: 20 }}
                  onClick={() => handleOpenCardtype(row, "UPDATE")}
                />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleOpenDeleteCardType(row.id)}
              >
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </>
          );
        },
      },
    ],
    [listOfCard]
  );
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <Dashboard>
      <h3 style={{ textAlign: "left" }}>CÀI ĐẶT CHUNG</h3>
      <form style={{ display: "flex", flexDirection: "row", gap: 50 }}>
        <div style={{ width: 600 }}>
          <Box sx={{ margin: "7px 16px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenEntryType("CREATE")}
            >
              Tạo định khoản
            </Button>
          </Box>
          <TableDataComponent
            columns={columns}
            dataInfo={accEntryType}
            getRowId={getRowId}
            isPage={true}
          />
        </div>
        <div style={{ width: 500 }}>
          <Box sx={{ margin: "7px 16px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenCardType("CREATE")}
            >
              Tạo loại thẻ
            </Button>
          </Box>
          <TableDataComponent
            columns={columnsCardType}
            dataInfo={listOfCard}
            isPage={true}
            getRowId={getRowId}
          />
        </div>
        <AddEntryTypeDialogComponent
          control={control}
          setValue={setValue}
          handleClickClose={handleCloseEntryType}
          openDialog={openDialogEntry}
          handleClickConfirm={handleConfirmCreateEntry}
        />
        <DialogDeleteComponent
          openDialog={isDeleteFormCardType}
          handleClickClose={handleCloseDeleteCardType}
          handleClickConfirm={handleConfirmDeleteCardType}
        />
        <DialogDeleteComponent
          openDialog={isDeleteForm}
          handleClickClose={handleCloseDeleteForm}
          handleClickConfirm={handleConfirmDeleteForm}
        />
        <AddCardTypeDialogComponent
          control={control}
          handleClickClose={handleCloseCardType}
          openDialog={openDialogCardType}
          handleClickConfirm={handleConfirmCardType}
        />
      </form>
    </Dashboard>
  );
};

export default SettingContent;
