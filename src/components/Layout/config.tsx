"use client";

import BarChartIcon from "@mui/icons-material/BarChart";
import { SvgIcon } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FaceIcon from "@mui/icons-material/Face";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ReceiptIcon from '@mui/icons-material/Receipt';
export const items = [
  {
    title: "Tổng quan",
    path: "/",
    icon: (
      <SvgIcon fontSize="medium">
        <BarChartIcon/>
      </SvgIcon>
    ),
    disabled: false
  },
  {
    title: "Hóa Đơn",
    path: "/invoice",
    icon: (
      <SvgIcon fontSize="medium">
        <DescriptionIcon/>
      </SvgIcon>
    ),
  },
  {
    title: "Quản Lý Hóa Đơn",
    path: "/invoiceManagement",
    icon: (
      <SvgIcon fontSize="medium">
        <FileCopyIcon />
      </SvgIcon>
    ),
    disabled: false

  },
  {
    title: "Sổ Thu Chi",
    path: "/accountingBook",
    icon: (
      <SvgIcon fontSize="medium">
        <MenuBookIcon />
      </SvgIcon>
    ),
    disabled: false

  },
  {
    title: "Tài khoản",
    path: "/account",
    icon: (
      <SvgIcon fontSize="medium">
        <FaceIcon />
      </SvgIcon>
    ),
    disabled: false

  },
  {
    title: "Test",
    path: "/test",
    icon: (
      <SvgIcon fontSize="medium">
        <DescriptionIcon />
      </SvgIcon>
    ),
    disabled: false

  },
  // {
  //   title: 'Settings',
  //   path: '/settings',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  {
    title: "Đăng nhập",
    path: "/auth/login",
    icon: (
      <SvgIcon fontSize="small">
        <LoginIcon />
      </SvgIcon>
    ),
    disabled: false

  },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
