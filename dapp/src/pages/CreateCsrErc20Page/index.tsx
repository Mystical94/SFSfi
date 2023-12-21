import { Container } from "@mui/material";
import { useState } from "react";
import CreateCsrErc20Form from "./CreateCsrErc20Form";
import SuccessMsg from "./SuccessMsg";
import { DeployedContract } from "../../lib/types";

const CreateCsrErc20Page = () => {
  const [contractDetails, setContractDetails] =
    useState<DeployedContract | null>(null);

  const handleFormOnCompleted = (data: DeployedContract) => {
    setContractDetails(data);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        marginTop: "40px",
      }}
    >
      {contractDetails ? (
        <SuccessMsg {...contractDetails} />
      ) : (
        <CreateCsrErc20Form onCompleted={handleFormOnCompleted} />
      )}
    </Container>
  );
};

export default CreateCsrErc20Page;
