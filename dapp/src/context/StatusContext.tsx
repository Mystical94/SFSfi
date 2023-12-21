// ErrorContext.tsx
import { createContext, FC, ReactElement, useContext, useState } from "react";
import { AlertColor } from "@mui/material";

interface SetStatusArgs {
  msg: string;
  severity: AlertColor;
  duration?: number | null;
  link?: string;
  linkText?: string;
}

interface StatusContextType {
  status: string | null;
  severity: AlertColor | null;
  setStatus: (data: SetStatusArgs) => void;
  resetStatus: () => void;
  duration: number | null;
  statusLinkText: string | null;
  statusLink: string | null;
}

export const StatusContext = createContext<StatusContextType>({
  status: null,
  severity: null,
  setStatus: () => {},
  resetStatus: () => {},
  duration: 6000,
  statusLinkText: null,
  statusLink: null,
});

export const ErrorProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [severityLevel, setSeverityLevel] = useState<AlertColor | null>(null);
  const [durationTime, setDurationTime] = useState<number | null>(6000);
  const [statusLink, setStatusLink] = useState<string | null>(null);
  const [statusLinkText, setStatusLinkText] = useState<string | null>(null);

  const handleSetStatus = ({
    msg,
    severity,
    duration = 6000,
    link,
    linkText,
  }: SetStatusArgs) => {
    setStatus(msg);
    setSeverityLevel(severity);
    setDurationTime(duration);
    setStatusLink(link || null);
    setStatusLinkText(linkText || null);
  };

  const resetStatus = () => {
    setStatus(null);
    setSeverityLevel(null);
    setDurationTime(null);
    setStatusLink(null);
    setStatusLinkText(null);
  };

  return (
    <StatusContext.Provider
      value={{
        status,
        setStatus: handleSetStatus,
        resetStatus,
        severity: severityLevel,
        duration: durationTime,
        statusLink,
        statusLinkText,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatusContext = (): StatusContextType => {
  return useContext(StatusContext);
};
