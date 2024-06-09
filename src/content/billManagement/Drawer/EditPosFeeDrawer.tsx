import { fetchGetAllCard } from "@/api/service/cardCustomerApis";
import TableDataComponent from "@/components/common/DataGrid";
import DrawerCustom from "@/components/common/Drawer";
import { LabelComponent } from "@/components/common/LabelComponent";
import { TextFieldCustom } from "@/components/common/Textfield";
import {
  ColCardType,
  ColPosManagement,
  FormParams,
  PosParamBodySend,
  SupportedCardTypesParam,
} from "@/models/PortManagementModel";
import { Box, Button, IconButton, Typography } from "@mui/material";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import { fetchCreatePos, fetchUpdatePos } from "@/api/service/posManagerApis";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { InputNumber } from "@/components/common/InputCustom";
import TextareaComponent from "@/components/common/TextAreaAutoSize";
import AutoCompleteMultiple from "@/components/common/AutoCompleteMultiple";
import { fetchBranch } from "@/api/service/invoiceManagement";
import { getValueWithComma } from "@/utils";
import SelectSearchComponent from "@/components/common/AutoComplete";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { fetchPos } from "@/actions/InvoiceManagementActions";
import _ from "lodash";
import {
  fetchUpdatePosFee,
  fetchUpdateRowPosFee,
} from "@/api/service/billManagement";

export interface NewPosDrawerProps {
  isOpen: boolean;
  handleCloseDrawer: () => void;
  rowInfo: any;
  handleSearch: () => void;
}
const ViewPosFeeDrawer = (props: NewPosDrawerProps) => {
  const { isOpen, handleCloseDrawer, rowInfo, handleSearch } = props;

  const dispatch = useDispatch();

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
      posId: {
        key: "",
        values: "",
      },
      posFeeStamp: "",
    },
  });
  useEffect(() => {
    if (rowInfo) {
      reset({
        posId: {
          key: rowInfo.posId,
          values: rowInfo.posFee,
        },
        posFeeStamp: rowInfo.percen,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowInfo]);

  const handleCreate = () => {
    if (watch("posId").key === "") {
      enqueueSnackbar("Mã Pos là bắt buộc", {
        variant: "warning",
      });
      return;
    }

    if (watch("posFeeStamp") === "") {
      enqueueSnackbar("Phần trăm phí là bắt buộc", {
        variant: "warning",
      });
      return;
    }
    if (
      watch("posFeeStamp") !== "" &&
      _.toNumber(watch("posFeeStamp").toString().replaceAll(",", "")) > 100
    ) {
      enqueueSnackbar("Phần trăm phí nhỏ hơn hoặc bằng 100", {
        variant: "warning",
      });
      return;
    }
    const { posFeeStamp, posId } = getValues();
    const bodySend = {
      posId: posId.key,
      posFeeStamp: _.toNumber(posFeeStamp.toString().replaceAll(",", "")),
    };
    fetchUpdateRowPosFee(rowInfo.idBill, bodySend)
      .then((res) => {
        enqueueSnackbar("Cập nhật Pos thành công", { variant: "success" });
        handleSearch();
      })
      .catch(function (error) {
        if (error.response.data.errors?.length > 0) {
          enqueueSnackbar(error.response.data.errors[0], { variant: "error" });
        } else {
          enqueueSnackbar("Cập nhật Pos thất bại", { variant: "error" });
        }
      });
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };
  const getDataFromApi = (value: string) => {
    dispatch(fetchPos({ posName: value }));
  };
  return (
    <>
      <DrawerCustom
        widthDrawer={340}
        isOpen={isOpen}
        title="Xem/Cập nhật pos"
        handleClose={handleCloseDrawer}
      >
        <form
          style={{ padding: 16 }}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit(handleCreate)}
        >
          <PageContent>
            <SearchContainer>
              <StyleInputContainer style={{ width: "80%" }}>
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
              <StyleInputContainer style={{ width: "84%" }}>
                {" "}
                <LabelComponent require={true}>Phần trăm phí </LabelComponent>
                <TextFieldCustom
                  {...register("posFeeStamp")}
                  iconend={<p style={{ width: 18 }}>%</p>}
                  onChange={(e: any) => {
                    setValue(
                      "posFeeStamp",
                      getValueWithComma(
                        e.target.value.trim().replaceAll(/[^0-9.]/g, "")
                      )
                    );
                  }}
                />
              </StyleInputContainer>
            </SearchContainer>

            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
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
                Cập nhật
              </Button>
            </Box>
          </PageContent>
        </form>
      </DrawerCustom>
    </>
  );
};
export default ViewPosFeeDrawer;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextHelper = styled.span`
  color: red;
  font-size: 12px;
`;
