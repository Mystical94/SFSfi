import { FC } from "react";
import { Snackbar, Alert, AlertColor, Link } from "@mui/material";
import { useStatusContext } from "../context/StatusContext";

const StatusSnackbar: FC = () => {
  const {
    status,
    severity,
    duration,
    statusLinkText,
    statusLink,
    resetStatus,
  } = useStatusContext();

  const handleClose = (): void => {
    resetStatus();
  };

  return status && severity ? (
    <Snackbar
      open
      autoHideDuration={duration}
      onClose={handleClose}
      ClickAwayListenerProps={{ onClickAway: () => null }}
    >
      <Alert onClose={handleClose} severity={severity as AlertColor}>
        {status}{" "}
        {statusLink && (
          <Link href={statusLink} target="_blank">
            {statusLinkText || statusLink}
          </Link>
        )}
      </Alert>
    </Snackbar>
  ) : null;
};

export default StatusSnackbar;
