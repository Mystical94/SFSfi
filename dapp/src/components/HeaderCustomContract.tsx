import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddress } from "ethers";
import { Box, TextField } from "@mui/material";
import { RequestPage } from "@mui/icons-material";
import useGetErc20Info from "../hooks/useGetErc20Info";
import useCsrErc20FactoryContract from "../hooks/useCsrErc20FactoryContract";

const HeaderCustomContract: FC<{
  onTokenFound: (customCsrErc20Address: string, symbol: string) => void;
}> = ({ onTokenFound }) => {
  const { getErc20Info } = useGetErc20Info();
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingAddressInfo, setLoadingAddressInfo] = useState(false);
  const { verifyCsrErc20 } = useCsrErc20FactoryContract();
  const [customCsrErc20Address, setCustomCsrErc20Address] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (customCsrErc20Address.length === 0) {
      setErrorMsg("");
      return;
    }
    if (customCsrErc20Address.length < 42) {
      setErrorMsg("Invalid address format");
      return;
    }
    const func = async () => {
      try {
        getAddress(customCsrErc20Address);
      } catch (e) {
        setErrorMsg("Invalid address format");
        return;
      }
      setLoadingAddressInfo(true);

      try {
        const [info, isValid] = await Promise.all([
          getErc20Info(customCsrErc20Address),
          verifyCsrErc20(customCsrErc20Address),
        ]);
        if (!isValid) {
          setErrorMsg("Not a CSR Token");
        }
        onTokenFound(customCsrErc20Address, info.symbol);
      } catch (e) {
        setErrorMsg("Not a CSR Token");
      } finally {
        setLoadingAddressInfo(false);
      }
    };
    func();
  }, [
    customCsrErc20Address,
    getErc20Info,
    setErrorMsg,
    verifyCsrErc20,
    setLoadingAddressInfo,
  ]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="10px"
        paddingTop="0"
        flexDirection="column"
        // sx={{ borderTop: 1, borderColor: "grey.500" }}
      >
        <Box
          sx={{ display: "flex", alignItems: errorMsg ? "center" : "flex-end" }}
        >
          <RequestPage sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Another csr address"
            variant="standard"
            value={customCsrErc20Address}
            onChange={(e) => setCustomCsrErc20Address(e.target.value)}
            error={!!errorMsg}
            helperText={errorMsg}
            onKeyDown={(e) =>
              (e.keyCode === 13 || e.key === "Enter") && errorMsg === ""
                ? navigate(`/csr-erc20/${customCsrErc20Address}`)
                : null
            }
          />
        </Box>
        {loadingAddressInfo && <Box>Loading...</Box>}
      </Box>
    </>
  );
};

export default HeaderCustomContract;
