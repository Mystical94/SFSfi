import { FC } from "react";
import { Grid, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string | number;
}

const ItemLine: FC<Props> = ({ label, value }) => {
  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <Typography variant="subtitle1" fontSize="12px">
          {label}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" fontSize="12px">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ItemLine;
