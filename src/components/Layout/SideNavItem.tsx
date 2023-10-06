import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";

interface SideNavItemProps {
  active: boolean;
  disabled?: boolean;
  external?: boolean;
  icon: React.ReactNode;
  path: String;
  title: String;
  open:boolean;
}
const SideNavItem = (props: SideNavItemProps) => {
  const { active = false, disabled, external, icon, path, title, open } = props;

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "10px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "danger.50",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
              ...(active && {
                color: "#fff",
              }),
            }}
          >
            {icon}
          </Box>
        )}
        {open && (
          <Box
            component="span"
            sx={{
              color: "neutral.400",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(active && {
                color: "common.white",
              }),
              ...(disabled && {
                color: "neutral.500",
              }),
            }}
          >
            {title}
          </Box>
        )}
      </ButtonBase>
    </li>
  );
};
export default SideNavItem;
