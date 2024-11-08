import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const ConversationTabHeader = ({ setItemSelected }) => {
  return (
    <Button mb={3} padding={0} onClick={() => setItemSelected("")}>
      <ArrowBackIcon />
    </Button>
  );
};

export default ConversationTabHeader;
