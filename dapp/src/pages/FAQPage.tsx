import { FC } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  Container,
  AccordionDetails,
} from "@mui/material";

const FAQPage: FC = () => {
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
      <Typography variant="h4" gutterBottom>
        FAQ
      </Typography>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">What is CSR?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Contract Secured Revenue (CSR) is a turnstile smart contract which
            enables the deployer of a smart contract to capture 20% of the gas
            fees generated when interacting with the smart contract.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">What is $csrCANTO?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            It is a wrapped version of $CANTO which is enabled with CSR, and
            redistributes the revenue to $csrCANTO holders.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">Why would I use this?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Because it is the same as $CANTO, except it is yield bearing, and
            the source of this yield is gas fees.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">What is the csrToken Factory?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can use this to create a CSR wrapper for any token! Just like
            how csrCANTO is the CSR version of CANTO, you can create the CSR
            version of any token. To do this, you first have to deploy the
            contract - which you can do on the website - and then you can wrap,
            unwrap, and claim rewards.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">
            How can I launch my own $csrTOKEN?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Very easily! Just head on over to our PAGE and put in the contract
            address and deploy to create a CSR wrapper - if it already exists,
            you will be notified. From there, you can now wrap and unwrap your
            favorite token into the CSR version of itself.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">Who gets the CSR rewards?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You, the holder, and whitelisted smart contracts. This is because we
            want to maximise the revenue given to $csrCANTO and $csrTOKEN
            holders, at the expense of smart contracts such as liquidity pools
            which will probably not even claim this revenue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">Who is the team?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We are an anon team (for now, due to regulatory concerns) and we
            have extensive backgrounds building and contributing in different
            ecosystems such as Arweave, Arbitrum, and Ethereum where we have
            explored different characteristics of each execution environment
            that enable novel mechanisms and allow us to create innovative
            products.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">
            If I LP my $csrCANTO or $csrTOKEN or deposit it in a smart contract,
            can I still claim CSR rewards?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            No. The smart contract which is the recipient of your tokens is now
            the owner of the $csrCANTO/$csrTOKEN. However, only EOAs and
            whitelisted smart contracts may claim CSR revenue. If it is a
            whitelisted contract, the admin may capture the CSR and share with
            the LPs or keep it for themselves. Builders - get in touch with us
            if you wish to whitelist your contracts and retain the CSR or
            redistribute to LPs.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary>
          <Typography variant="h6">Is there a roadmap?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Yes, please see our docs.</Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default FAQPage;
