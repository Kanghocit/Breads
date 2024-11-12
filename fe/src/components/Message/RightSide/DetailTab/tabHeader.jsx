import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

const ConversationTabHeader = ({ setItemSelected, color = "" }) => {
  return (
    <Button mb={3} padding={0} onClick={() => setItemSelected("")}>
      <ArrowBackIcon color={color ? color : ""} />
    </Button>
  );
};

export default ConversationTabHeader;
