import { ChevronDownIcon } from "@chakra-ui/icons";
import { Container, Flex, Text, useColorMode } from "@chakra-ui/react";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { containerBoxWidth } from "../components/MainBoxLayout";
import { changeDisplayPageData } from "../store/UtilSlice";
import ClickOutsideComponent from "../util/ClickoutCPN";

export const HeaderHeight = 60;

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((state) => state.util.currentPage);
  const userSelected = useSelector((state) => state.user.userSelected);
  const { colorMode } = useColorMode();
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
    POST_DETAIL,
    FRIEND,
  } = PageConstant;

  const getBoxItems = () => {
    switch (currentPage) {
      case HOME:
        return ["Dành cho bạn", "Đang theo dõi", "Đã thích", "Đã lưu"];
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
        result = "Dành cho bạn";
      } else if (!pathname || pathname === FOLLOWING) {
        result = "Đang theo dõi";
      } else if (!pathname || pathname === LIKED) {
        result = "Đã thích";
      } else if (!pathname || pathname === SAVED) {
        result = "Đã lưu";
      } else if (currentPage === HOME) {
        result = pathname;
      } else if (currentPage === ACTIVITY) {
        result = pathname.replace(ACTIVITY + "/", "");
      }
      return result[0]?.toUpperCase() + result.slice(1, result.length);
    } else if (currentPage === SEARCH) {
      return "Tìm kiếm";
    } else if (currentPage === USER) {
      return "Trang cá nhân";
    } else if (currentPage === FRIEND) {
      return userSelected?.username ?? "Friend";
    } else if (currentPage === POST_DETAIL) {
      return "Bread";
    }
  };

  const handleNavigate = (item) => {
    if (currentPage === ACTIVITY) {
      navigate(ACTIVITY + "/" + item);
      dispatch(changeDisplayPageData(item));
    } else {
      if (item === "Dành cho bạn") {
        navigate("/" + FOR_YOU);
        dispatch(changeDisplayPageData(FOR_YOU));
      } else if (item === "Đang theo dõi") {
        navigate("/" + FOLLOWING);
        dispatch(changeDisplayPageData(FOLLOWING));
      } else if (item === "Đã thích") {
        navigate("/" + LIKED);
        dispatch(changeDisplayPageData(LIKED));
      } else if (item === "Đã lưu") {
        navigate("/" + SAVED);
        dispatch(changeDisplayPageData(SAVED));
      } else {
        navigate("/" + item);
        dispatch(changeDisplayPageData(item));
      }
    }
  };

  return (
    <>
      <Flex
        position={"fixed"}
        left={0}
        top={0}
        width={"100vw"}
        maxWidth={"100vw"}
        height={HeaderHeight + "px"}
        zIndex={999}
        justifyContent={"center"}
        alignItems={"center"}
        bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
      >
        <Flex
          width={containerBoxWidth}
          maxWidth={containerBoxWidth}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={"12px"}
          position={"relative"}
          fontWeight={600}
          fontSize={"17px"}
        >
          {getHeaderContent()}
          {[HOME, ACTIVITY].includes(currentPage) && (
            <ClickOutsideComponent onClose={() => setOpenBox(false)}>
              <ChevronDownIcon
                width={"32px"}
                height={"32px"}
                padding={"4px"}
                borderRadius={"50%"}
                cursor={"pointer"}
                transform={openBox ? "rotate(180deg)" : ""}
                _hover={{ bg: colorMode === "dark" ? "#171717" : "#f0f0f0" }}
                onClick={() => setOpenBox(!openBox)}
              />
              {openBox && (
                <Container
                  position={"absolute"}
                  top={"calc(100% - 12px)"}
                  left={"50%"}
                  width={"200px"}
                  height={"fit-content"}
                  borderRadius={"12px"}
                  padding="8px 12px"
                  overflow={"hidden"}
                  bg={colorMode === "dark" ? "#0a0a0a" : "#ffffff"}
                  boxShadow={"0px 0px 8px -3px rgba(0,0,0,0.53)"}
                >
                  {getBoxItems()?.map((item) => (
                    <Text
                      width={"100%"}
                      key={item}
                      padding="8px 12px"
                      cursor={"pointer"}
                      borderRadius={"8px"}
                      _hover={{
                        bg: colorMode === "dark" ? "#171717" : "#f0f0f0",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigate(item);
                        setOpenBox(false);
                      }}
                    >
                      {item[0].toUpperCase() + item.slice(1, item.length)}
                    </Text>
                  ))}
                </Container>
              )}
            </ClickOutsideComponent>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default memo(Header);
