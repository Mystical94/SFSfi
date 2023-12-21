import { FC } from "react";
import { Box } from "@mui/material";
import MinidenticonImg from "./MinidenticonImg";

interface Props {
  text: string;
  imgSrc?: string;
  imgGenerateValue?: string;
}

const IMG_STYLE = {
  height: "20px",
  marginRight: "5px",
};

const HeaderTokenDropdownItem: FC<Props> = ({
  text,
  imgSrc,
  imgGenerateValue,
}) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    {imgSrc && <img src={imgSrc} alt={text} style={IMG_STYLE} />}
    {!imgSrc && imgGenerateValue && (
      <MinidenticonImg
        value={imgGenerateValue}
        color="#FCDD50"
        style={IMG_STYLE}
      />
    )}
    <span>{text}</span>
  </Box>
);

export default HeaderTokenDropdownItem;
