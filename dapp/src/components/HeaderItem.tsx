import { FC } from "react";
import { Button, Box, SvgIcon, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface HeaderItemProps {
  text: string;
  to: string;
  Icon: typeof SvgIcon;
}

const HeaderItem: FC<HeaderItemProps> = ({ text, to, Icon }) => {
  const location = useLocation();

  const isActive = location.pathname === to;
  const color = isActive ? "secondary" : "primary";
  const textColor = isActive ? "text.primary" : "text.secondary";

  return (
    <Button color="inherit" component={RouterLink} to={to}>
      <Box display="flex" alignItems="center">
        <Icon color={color} />
        <Box ml={1} color={textColor}>
          <Typography fontSize={"24px"}>{text}</Typography>
        </Box>
      </Box>
    </Button>
  );
};

export default HeaderItem;
