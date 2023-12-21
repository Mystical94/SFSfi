import { FC, useEffect, useState, ComponentType } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCsrErc20FactoryContract from "../hooks/useCsrErc20FactoryContract";
import env from "../env";

interface WithTokenAddressesProps {
  erc20TokenAddress: string;
  csrErc20TokenAddress: string;
}

const withTokenAddresses = (
  Component: ComponentType<WithTokenAddressesProps>
) => {
  const TokenAddressesHOC: FC = () => {
    const { erc20Address, csrErc20Address } = useParams();
    const [erc20TokenAddress, setErc20TokenAddress] = useState<string | null>(
      null
    );
    const [csrErc20TokenAddress, setCsrErc20TokenAddress] = useState<
      string | null
    >(null);
    const { getCsrErc20Address, getErc20Address, verifyCsrErc20 } =
      useCsrErc20FactoryContract();
    const navigate = useNavigate();
    const [isCsrValid, setIsCsrValid] = useState<boolean | null>(null);

    useEffect(() => {
      const setupContracts = async () => {
        if (csrErc20Address === env.CONTRACTS.CSRCANTO) {
          navigate("/");
        }

        if (erc20Address) {
          const csrErc20 = await getCsrErc20Address(erc20Address);
          if (!csrErc20) {
            navigate("/csr-erc20");
          } else {
            setErc20TokenAddress(erc20Address);
            setCsrErc20TokenAddress(csrErc20.address);
          }
        } else if (csrErc20Address) {
          const erc20 = await getErc20Address(csrErc20Address);
          setCsrErc20TokenAddress(csrErc20Address);
          setErc20TokenAddress(erc20);
        } else {
          navigate("/");
        }
      };
      setupContracts();
    }, [erc20Address, csrErc20Address]);

    useEffect(() => {
      if (!csrErc20TokenAddress) {
        return;
      }
      const func = async () => {
        const valid = await verifyCsrErc20(csrErc20TokenAddress);
        setIsCsrValid(valid);
      };
      func();
    }, [csrErc20TokenAddress, verifyCsrErc20]);

    if (isCsrValid === false) {
      return <div>Invalid CSR ERC20 address</div>;
    }

    if (!erc20TokenAddress || !csrErc20TokenAddress) {
      return null;
    }

    return (
      <Component
        erc20TokenAddress={erc20TokenAddress}
        csrErc20TokenAddress={csrErc20TokenAddress}
      />
    );
  };

  return TokenAddressesHOC;
};

export default withTokenAddresses;
