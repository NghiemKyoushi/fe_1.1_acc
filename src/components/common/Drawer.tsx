import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
type Anchor = "right";

interface DrawerProps {
  widthDrawer: number;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}
export default function DrawerCustom(props: DrawerProps) {
  const { widthDrawer, children, isOpen, handleClose, title } = props;
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  return (
    <div>
      <React.Fragment key={"right"}>
        <Drawer anchor={"right"} open={isOpen} onClose={() => handleClose()}>
          <StyleHeaderDrawer>
            <StyleTitle>{title}</StyleTitle>
            <StyleIcon onClick={() => handleClose()}>
              <IconButton onClick={() => handleClose()}>
                <CloseIcon />
              </IconButton>
            </StyleIcon>
          </StyleHeaderDrawer>

          <Divider />
          <Box
            sx={{ width: widthDrawer }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            // onKeyDown={toggleDrawer(anchor, false)}
          >
            {children}
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}

const StyleHeaderDrawer = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;
  flex-direction: row;
`;
const StyleIcon = styled.div`
  display: flex;
  justify-content: center;
`;
const StyleTitle = styled.p`
  font-weight: bold;
  font-size: 20px;
  padding: 0px 32px;
`;
