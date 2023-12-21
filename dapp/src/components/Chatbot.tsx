import { FC, useState } from "react";
import Dialog from '@mui/material/Dialog';
import { Button } from "@mui/material";
import { SmartToy } from '@mui/icons-material';

const ChatBot: FC = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (<>
    <Button
      variant="contained"
      onClick={handleClickOpen}
      startIcon={<SmartToy />}
      size="large"
      style={{
        position: "fixed",
        bottom: 60,
        right: 0,
        margin: "1rem",
        opacity: 1,
        transition: "opacity 5s"
      }}
    >
      csr BOT
    </Button>
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/5JHP3qGfysYkdyPVh41_g"
        width="100%"
        height={500}
        style={{ border: "none" }}
      />
    </Dialog>
  </>);
};

export default ChatBot;
