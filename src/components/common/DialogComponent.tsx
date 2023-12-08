"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { Breakpoint, styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    // minHeight: "40vh",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }} {...other}>
      {children}
      {/* {onClose ? ( */}
      <IconButton
        aria-label="close"
        onClick={() => onClose()}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {/* ) : null} */}
    </DialogTitle>
  );
}
export interface CustomizedDialogsProps {
  open: boolean;
  title: string;
  size: Breakpoint;
  children: React.ReactNode;
  confirm?: boolean;
  titleConfirmButton?: string;
  handleClickClose: () => void;
  handleClickConfirm?: () => void;
}

export default function CustomizedDialogs(props: CustomizedDialogsProps) {
  const {
    open,
    children,
    title,
    size,
    confirm,
    titleConfirmButton,
    handleClickConfirm,
    handleClickClose,
  } = props;
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>(size);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
  //   setMaxWidth(event.target.value);
  // };

  // const handleFullWidthChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setFullWidth(event.target.checked);
  // };

  return (
    <div>
      <BootstrapDialog
        // onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          onClose={handleClickClose}
          id="customized-dialog-title"
        >
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions disableSpacing>
          {confirm ? (
            <div>
              <Button
                color="success"
                size="small"
                autoFocus
                variant="contained"
                onClick={handleClickConfirm}
              >
                {titleConfirmButton}
              </Button>
              <Button
                sx={{ marginLeft: 2 }}
                size="small"
                color="error"
                autoFocus
                variant="contained"
                onClick={() => handleClickClose()}
              >
                Hủy bỏ
              </Button>
            </div>
          ) : (
            <Button autoFocus onClick={() => handleClickClose()}>
              Hủy
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
