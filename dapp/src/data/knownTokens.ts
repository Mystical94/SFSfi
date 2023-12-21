import csrNOTE from "../static/csrNOTE.png";
import csrCINU from "../static/csrCINU.png";
import NOTE from "../static/NOTE.png";
import CINU from "../static/CINU.png";

interface KnownToken {
  symbol: string;
  csrErc20Address: string;
  csrErc20Icon: string;
  erc20Address: string;
  erc20Icon: string;
}

const KNOWN_TOKENS: KnownToken[] = [
  {
    symbol: "NOTE",
    csrErc20Address: "0x2b11F2029b7e56e0128d920212C2f48A1C238275",
    csrErc20Icon: csrNOTE,
    erc20Address: "0x4e71A2E537B7f9D9413D3991D37958c0b5e1e503",
    erc20Icon: NOTE
  },
  {
    symbol: "CINU",
    csrErc20Address: "0x032F31A1fb5fbAd2499Ae98645832eBa2D614228",
    csrErc20Icon: csrCINU,
    erc20Address: "0x7264610A66EcA758A8ce95CF11Ff5741E1fd0455",
    erc20Icon: CINU
  }
];
export default KNOWN_TOKENS;
