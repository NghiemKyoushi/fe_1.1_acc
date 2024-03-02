import { fetchGetAllCard } from "@/api/service/cardCustomerApis";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import { cardType } from "@/models/CardCustomerModel";
import {
  ColCardType,
  PosParamBodySend,
  SupportedCardTypesParam,
} from "@/models/PortManagementModel";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { fetchCreatePos } from "@/api/service/posManagerApis";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { NewCustomer } from "@/models/CustomerManager";
import { createNewCustomer } from "@/api/service/customerManagerApis";
import { handleKeyPress } from "@/utils";
import TextareaComponent from "@/components/common/TextAreaAutoSize";

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  handleSearch: () => void;
}
const NewCustomerDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer, handleSearch } = props;
  const [listOfCard, setListOfCard] = useState<ColCardType[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
    getValues,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      nationalId: "",
      percentageFee: "",
      note: "",
    },
  });
  const dispatch = useDispatch();

  const handleCreate = () => {
    const { name, address, nationalId, note, percentageFee, phoneNumber } =
      getValues();
    const bodySend: NewCustomer = {
      address: address,
      name: name,
      nationalId: nationalId,
      percentageFee: +percentageFee,
      phoneNumber: phoneNumber,
      note: note,
    };
    createNewCustomer(bodySend)
      .then((res) => {
        enqueueSnackbar("Tạo khách hàng thành công!!", { variant: "success" });
        handleCloseDrawer();
        handleSearch();
        reset();
      })
      .catch(function (error) {
        enqueueSnackbar("Tạo khách hàng thất bại", { variant: "error" });
      });
  };
  const getRowId = (row: any) => {
    return row.id;
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={540}
        isOpen={isOpen}
        title="Tạo khách hàng"
        handleClose={handleCloseDrawer}
      >
        <form
          onKeyPress={handleKeyPress}
          style={{ padding: 16 }}
          onSubmit={handleSubmit(handleCreate)}
        >
          <PageContent>
            <SearchContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>
                    Họ tên khách hàng
                  </LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("name", { required: "Tên khách là bắt buộc" })}
                  />
                  <TextHelper>{errors?.name && errors.name.message}</TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Số điện thoại</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("phoneNumber", {
                      required: "Số điện thoại là bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors?.phoneNumber && errors.phoneNumber.message}
                  </TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Phần trăm phí</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("percentageFee", {
                      required: "Phần trăm phí là bắt buộc",
                    })}
                    onChange={(e: any) => {
                      setValue(
                        "percentageFee",
                        e.target.value.trim().replaceAll(/[^0-9]/g, "")
                      );
                    }}
                  />
                  <TextHelper>
                    {errors?.percentageFee && errors.percentageFee.message}
                  </TextHelper>
                </StyleInputContainer>
              </StyleContainer>
              <StyleContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>
                    Số căn cước công dân
                  </LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("nationalId", {
                      required: "Số CCCD là bắt buộc",
                    })}
                    onChange={(e: any) => {
                      setValue(
                        "nationalId",
                        e.target.value.trim().replaceAll(/[^0-9]/g, "")
                      );
                    }}
                  />
                  <TextHelper>
                    {errors?.nationalId && errors.nationalId.message}
                  </TextHelper>
                </StyleInputContainer>
                <StyleInputContainer>
                  <LabelComponent require={true}>Địa chỉ</LabelComponent>
                  <TextFieldCustom
                    type={"text"}
                    {...register("address", {
                      required: "Địa chỉ là bắt buộc",
                    })}
                  />
                  <TextHelper>
                    {errors?.address && errors.address.message}
                  </TextHelper>
                </StyleInputContainer>
              </StyleContainer>
            </SearchContainer>
            <div style={{ width: "60%" }}>
              <Typography style={{ fontWeight: "bold", marginTop: 10 }}>
                Ghi chú
              </Typography>
              <TextareaComponent
                control={control}
                valueInput={""}
                name={"note"}
                label={"Ghi chú"}
                width={"100"}
                type={""}
                disable={false}
              />
            </div>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                marginTop: 3,
                padding: "0px 16px 8px 16px",
              }}
            >
              {" "}
              <Button
                style={{ marginTop: 30 }}
                variant="contained"
                size="small"
                type="submit"
              >
                Thêm mới khách hàng
              </Button>
            </Box>
          </PageContent>
        </form>
      </DrawerCustom>
    </>
  );
};
export default NewCustomerDrawer;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyleDataGrid = styled.div`
  width: 360px;
  padding: 0px 0px;
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
  flex-direction: column;
  gap: 18px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`;
const TextHelper = styled.span`
  color: red;
  font-size: 12px;
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
`;
