import {
  AppBar,
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WrapIcon from "@mui/icons-material/WrapText";
import { Link, useMatches, useNavigate } from "react-router-dom";
import LogoImg from "../static/logo.png";
import WalletConnection from "./WalletConnection";
import HeaderItem from "./HeaderItem";
import MobileDrawerMenu from "./MobileDrawerMenu";
import KNOWN_TOKENS from "../data/knownTokens";
import { PathId } from "../constants";
import SfsEthLogo from "../static/sfs_eth-logo.svg";
import HeaderTokenDropdownItem from "./HeaderTokenDropdownItem";
import ThemeToggleButton from "./ThemeToggleButton";
import HeaderCustomContract from "./HeaderCustomContract";
import useErc20Info from "../hooks/useErc20Info";
import useCsrErc20FactoryContract from "../hooks/useCsrErc20FactoryContract";

const Header: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedOption, setSelectedOption] = useState(0);
  const navigate = useNavigate();
  const urlMatches = useMatches();
  const pathId = urlMatches[1].id as PathId;

  const [customCsrErc20Address, setCustomCsrErc20Address] = useState("");
  const [customTokenSymbol, setCustomTokenSymbol] = useState("");
  const csrErc20UrlInfo = useErc20Info(urlMatches[1].params.csrErc20Address);
  const erc20UrlInfo = useErc20Info(urlMatches[1].params.erc20Address);
  const [csrErc20FromUrlErc20Address, setCsrErc20FromUrlErc20Address] =
    useState("");
  const { getCsrErc20Address } = useCsrErc20FactoryContract();

  const setCustomToken = useCallback(
    (address: string, symbol: string) => {
      setCustomCsrErc20Address(address);
      setCustomTokenSymbol(symbol);
    },
    [setCustomCsrErc20Address, setCustomTokenSymbol]
  );

  useEffect(() => {
    const func = async () => {
      if (!urlMatches[1].params.erc20Address) {
        return;
      }
      const csrErc20 = await getCsrErc20Address(
        urlMatches[1].params.erc20Address
      );
      if (csrErc20) {
        setCsrErc20FromUrlErc20Address(csrErc20.address);
      }
    };

    func();
  }, [urlMatches[1].params.erc20Address]);

  const wrapLink = useMemo(() => {
    switch (pathId) {
      case PathId.CsrErc20Wrap:
      case PathId.CsrErc20Claim:
        return `/csr-erc20/${urlMatches[1].params.csrErc20Address}`;
      case PathId.Erc20Wrap:
      case PathId.Erc20Claim:
        return `/csr-erc20/erc20/${urlMatches[1].params.erc20Address}`;
      default:
        return "/";
    }
  }, [urlMatches]);

  const items = [
    { text: "Wrap", icon: WrapIcon, link: wrapLink },
    {
      text: "Rewards",
      icon: EmojiEventsIcon,
      link: `${wrapLink === "/" ? "" : wrapLink}/claim`,
    },
  ];

  const matchedAddress =
    urlMatches[1].params.erc20Address || urlMatches[1].params.csrErc20Address;

  const knownTokenIndex = KNOWN_TOKENS.findIndex((i) =>
    [i.erc20Address, i.csrErc20Address].includes(matchedAddress as string)
  );

  useEffect(() => {
    switch (pathId) {
      case PathId.CsrErc20Create:
        return setSelectedOption(999);
      case PathId.WrapCanto:
      case PathId.CantoClaim:
        return setSelectedOption(0);
      case PathId.CsrErc20Claim:
      case PathId.Erc20Claim:
      case PathId.CsrErc20Wrap:
      case PathId.Erc20Wrap:
        return setSelectedOption(
          knownTokenIndex !== -1 ? knownTokenIndex + 1 : -1
        );
      default:
        return setSelectedOption(0);
    }
  }, [pathId]);

  const handleDropdownChange = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value as number;
    setSelectedOption(selectedValue);
    switch (selectedValue) {
      case -1:
        return null;
      case 0:
        return navigate("");
      case 998:
        return navigate(`/csr-erc20/${customCsrErc20Address}`);
      case 999:
        return navigate("/csr-erc20");
      default:
        return navigate(
          `/csr-erc20/${KNOWN_TOKENS[selectedValue - 1].csrErc20Address}`
        );
    }
  };

  const showWrapRewords = useMemo(
    () =>
      [
        PathId.CsrErc20Claim,
        PathId.Erc20Claim,
        PathId.CsrErc20Wrap,
        PathId.Erc20Wrap,
        PathId.WrapCanto,
        PathId.CantoClaim,
      ].includes(pathId),
    [pathId]
  );

  const urlProvidedErc20Symbol = useMemo(() => {
    if (csrErc20UrlInfo?.symbol) {
      return csrErc20UrlInfo.symbol;
    }
    if (erc20UrlInfo?.symbol) {
      return `csr${erc20UrlInfo.symbol}`;
    }
    return null;
  }, [csrErc20UrlInfo?.symbol, erc20UrlInfo?.symbol]);

  return (
    <AppBar position="static" style={{ background: "none", boxShadow: "none" }}>
      <Container maxWidth={false}>
        <Toolbar
          disableGutters
          sx={{
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "space-between",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <Box
              sx={{
                ...(isMobile
                  ? {
                      display: "none",
                    }
                  : { width: "230px" }),
              }}
            >
              <Link to="/">
                <img src={LogoImg} alt="Logo" height="40" />
              </Link>
            </Box>
            {isMobile && <MobileDrawerMenu />}
            <Box sx={{ flexGrow: 1, display: isMobile ? "block" : "none" }} />
            <Select
              value={selectedOption}
              onChange={handleDropdownChange}
              sx={{
                minWidth: isMobile ? 150 : 250,
                margin: theme.spacing(1, 0),
              }}
            >
              <MenuItem value={0}>
                <HeaderTokenDropdownItem
                  text="$sfsETH"
                  imgSrc={SfsEthLogo}
                />
              </MenuItem>
              {/* {KNOWN_TOKENS.map(({ csrErc20Address, symbol, erc20Icon }, i) => (
                <MenuItem value={i + 1} key={csrErc20Address}>
                  <HeaderTokenDropdownItem
                    text={`$csr${symbol}`}
                    imgGenerateValue={csrErc20Address}
                    imgSrc={erc20Icon}
                  />
                </MenuItem>
              ))} */}
              {/* NOTE: Temporary display none so don't have to comment out half the file to handle typescript errors */}
              <div style={{ display: "none" }}>
                <HeaderCustomContract onTokenFound={setCustomToken} />
              </div>
              {/* {customCsrErc20Address && (
                <MenuItem value={998}>
                  <HeaderTokenDropdownItem
                    text={`$${customTokenSymbol}`}
                    imgGenerateValue={customCsrErc20Address}
                  />
                </MenuItem>
              )} */}
              {/* <MenuItem
                value={999}
                sx={{ borderTop: 1, borderColor: "grey.500" }}
              >
                <HeaderTokenDropdownItem text="Create your own!" />
              </MenuItem> */}
              <MenuItem
                value={9999}
                disabled={true}
                sx={{ borderTop: 1, borderColor: "grey.500" }}
              >
                <div style={{ paddingTop: 8 }}>
                  <HeaderTokenDropdownItem text="More Coming Soon!" />
                </div>
              </MenuItem>
              {knownTokenIndex === -1 && matchedAddress && (
                <MenuItem value={-1}>
                  <HeaderTokenDropdownItem
                    imgGenerateValue={
                      urlMatches[1].params.csrErc20Address ||
                      csrErc20FromUrlErc20Address ||
                      customCsrErc20Address
                    }
                    text={
                      customTokenSymbol ||
                      urlProvidedErc20Symbol ||
                      "Unknown token"
                    }
                  />
                </MenuItem>
              )}
            </Select>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "230px",
              }}
            >
              {!isMobile && <ThemeToggleButton hideText />}
              <WalletConnection />
            </Box>
          </Box>
          {showWrapRewords && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {items.map((item) => (
                <HeaderItem
                  text={item.text}
                  to={item.link}
                  Icon={item.icon}
                  key={item.text}
                />
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
