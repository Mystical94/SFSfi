import { FC, ImgHTMLAttributes, useMemo } from "react";
import { minidenticon } from "../lib/minidenticon";

const MinidenticonImg: FC<
  { value: string; color: string } & ImgHTMLAttributes<any>
> = ({ value, color, ...props }) => {
  const svgURI = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        minidenticon(value, color)
      )}`,
    [value, color]
  );
  return <img {...props} src={svgURI} />;
};

export default MinidenticonImg;
