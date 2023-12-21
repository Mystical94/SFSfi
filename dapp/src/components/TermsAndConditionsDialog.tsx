import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Divider from "@mui/material/Divider";

const TermsAndConditionsDialog: FC = () => {
  const [open, setOpen] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("TermsAndConditions", "accepted");
    setOpen(false);
  };

  useEffect(() => {
    const ToC = localStorage.getItem("TermsAndConditions");
    if (!ToC) setOpen(true);
  }, []);

  const descriptionElementRef = useRef<HTMLElement>(null);

  return (
    <Dialog
      open={open}
      scroll={"body"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Terms & Conditions</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <ReactMarkdown
            children={`
## Disclaimer

1. csrCANTO has NOT been audited yet, please use at your own risk.
2. the purpose csrCANTO is to be a public good on the canto blockchain
3. we do not collect any form of data from users
          `}
          />
          <Divider />
          <ReactMarkdown
            children={`
## Legal

__1. General Terms:__

- Users must agree to abide by all applicable local laws and regulations.
- Users are responsible for their own actions and bear all risks associated with using the protocol.

__2. Smart Contract Risks:__

- Users acknowledge the inherent risks associated with smart contracts, including coding errors, hacking, and vulnerabilities.
- Users understand that transactions on the blockchain are irreversible and are responsible for verifying all transaction details

__3. Funds and Security:__

- Users are solely responsible for the security of their accounts, private keys, and passwords.
- The protocol will not be held liable for any loss or theft of funds resulting from user negligence.
- Users must not attempt to gain unauthorized access to other users' accounts or engage in any hacking or phishing activities.

__4. Limitation of Liability:__

- The protocol and its developers will not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of the protocol.
- Users agree to indemnify and hold the protocol and its developers harmless from any claims, losses, or damages resulting from their use of the protocol.
          `}
          />
          <Divider />
          <ReactMarkdown
            children={`
The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
          `}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button onClick={handleAccept} color="secondary" variant="contained">
          Agree and enter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;
