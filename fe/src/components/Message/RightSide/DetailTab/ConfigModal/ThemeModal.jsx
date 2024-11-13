import { Container, Flex, Text } from "@chakra-ui/react";
import { messageThemes } from "../../../../../util/Themes/index";
import Socket from "../../../../../socket";
import { useDispatch } from "react-redux";

const ThemeModal = ({ setItemSelected }) => {
  const dispatch = useDispatch();
  const handleSelectTheme = async (theme) => {
    const socket = Socket.getInstant();
    setItemSelected("");
  };

  return (
    <>
      <Container p={0} m={0}>
        <Text p={2} borderBottom={"1px solid gray"}>
          Select your theme
        </Text>
        <Container p={0} m={0} overflowY={"scroll"} maxHeight={"60vh"}>
          <Flex
            flexWrap={"wrap"}
            width={"100%"}
            height={"fit-content"}
            gap={2}
            mt={3}
          >
            {Object.keys(messageThemes).map((theme) => {
              const themeInfo = messageThemes[theme];
              const themeName = themeInfo.name;
              const themeBg = themeInfo.conversationBackground.backgroundImage;
              const textColor = themeInfo.user1Message.color;
              return (
                <Container
                  pos={"relative"}
                  width={"30%"}
                  height={"160px"}
                  borderRadius={4}
                  backgroundImage={`url(${themeBg})`}
                  backgroundRepeat={"no-repeat"}
                  backgroundSize={"cover"}
                  backgroundColor={
                    !themeBg
                      ? themeInfo.conversationBackground.backgroundColor
                      : ""
                  }
                  cursor={"pointer"}
                  _hover={{
                    opacity: 0.8,
                  }}
                  onClick={() => {
                    handleSelectTheme(theme);
                  }}
                >
                  <Text
                    color={textColor}
                    position={"absolute"}
                    left={"8px"}
                    bottom={"4px"}
                  >
                    {themeName}
                  </Text>
                </Container>
              );
            })}
          </Flex>
        </Container>
      </Container>
    </>
  );
};

export default ThemeModal;
