import { ChevronDownIcon } from "@chakra-ui/icons";
import { Container, Flex, Text } from "@chakra-ui/react";
import { CiCircleMore } from "react-icons/ci";
import { useSelector } from "react-redux";
import { containerBoxWidth } from "../components/MainBoxLayout";
import PageConstant from "../util/PageConstants";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const HeaderHeight = "80px";

const Header = () => {
  const navigate = useNavigate();
  const currentPage = useSelector((state) => state.util.currentPage);
  const [openBox, setOpenBox] = useState(false);
  const {
    HOME,
    FOR_YOU,
    FOLLOWING,
    LIKED,
    SAVED,
    ACTIVITY,
    FOLLOWS,
    REPLIES,
    MENTIONS,
    QUOTES,
    REPOSTS,
    SEARCH,
    USER,
  } = PageConstant;

  const getBoxItems = () => {
    switch (currentPage) {
      case HOME:
        return ["For you", FOLLOWING, LIKED, SAVED];
      case ACTIVITY:
        return ["All", FOLLOWS, REPLIES, MENTIONS, QUOTES, REPOSTS];
    }
  };

  const getHeaderContent = () => {
    if ([HOME, ACTIVITY].includes(currentPage)) {
      let pathname = window.location.pathname;
      pathname = pathname.slice(1, pathname.length);
      let result = "";
      if (!pathname || pathname === FOR_YOU) {
        result = "For you";
      } else if (currentPage === HOME) {
        result = pathname;
      } else if (currentPage === ACTIVITY) {
        result = pathname.replace(ACTIVITY + "/", "");
      }
      return result[0]?.toUpperCase() + result.slice(1, result.length);
    } else if (currentPage === SEARCH) {
      return "Search";
    } else if (currentPage === USER) {
      return "User profile";
    }
  };

  const handleNavigate = (item) => {
    if (currentPage === ACTIVITY) {
      navigate(ACTIVITY + "/" + item);
    } else {
      if (item === "For you") {
        navigate("/" + FOR_YOU);
      } else {
        navigate("/" + item);
      }
    }
  };

  console.log(getBoxItems());

  return (
    <>
      <Flex
        position={"fixed"}
        left={0}
        top={0}
        width={"100vw"}
        maxWidth={"100vw"}
        height={HeaderHeight}
        zIndex={1000}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"#101010"}
      >
        <Flex
          width={containerBoxWidth}
          maxWidth={containerBoxWidth}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"12px"}
          position={"relative"}
        >
          {getHeaderContent()}
          {[HOME, ACTIVITY].includes(currentPage) && (
            <ChevronDownIcon
              width={"32px"}
              height={"32px"}
              padding={"4px"}
              borderRadius={"50%"}
              cursor={"pointer"}
              transform={openBox ? "rotate(180deg)" : ""}
              _hover={{
                bg: "gray",
              }}
              onClick={() => setOpenBox(!openBox)}
            />
          )}
          {openBox && (
            <Container
              position={"absolute"}
              top={"calc(100% - 12px)"}
              left={"50%"}
              width={"200px"}
              bg={"gray"}
              height={"fit-content"}
              borderRadius={"12px"}
              padding="0"
              overflow={"hidden"}
            >
              {getBoxItems()?.map((item) => (
                <Text
                  width={"100%"}
                  key={item}
                  padding="12px 24px"
                  cursor={"pointer"}
                  _hover={{ bg: "lightgray" }}
                  onClick={() => {
                    handleNavigate(item);
                    setOpenBox(false);
                  }}
                >
                  {item[0].toUpperCase() + item.slice(1, item.length)}
                </Text>
              ))}
            </Container>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default memo(Header);
