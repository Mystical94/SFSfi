import { FC } from "react";
import { Box, styled, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 30,
  borderRadius: 5,
}));

interface Props {
  progress: number;
  label: string;
}

const LabeledProgressBar: FC<Props> = ({ progress, label }) => (
  <Box position="relative">
    <BorderLinearProgress
      variant="determinate"
      value={progress}
      color={"secondary"}
    />
    <Typography
      variant="caption"
      align="center"
      display="block"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "max-content",
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default LabeledProgressBar;
