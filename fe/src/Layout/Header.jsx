import { ChevronDownIcon } from "@chakra-ui/icons";
import { Container, Flex, Text, useColorMode } from "@chakra-ui/react";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { containerBoxWidth } from "../components/MainBoxLayout";
import { changeDisplayPageData } from "../store/UtilSlice";
import ClickOutsideComponent from "../util/ClickoutCPN";
import { useTranslation } from "react-i18next";
import { BtnLike, BtnMess } from "./LeftSideBar/ActionsBtns";

export const HeaderHeight = 60;

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPage = useSelector((state) => state.util.currentPage);
  const userSelected = useSelector((state) => state.user.userSelected);
  const { colorMode } = useColorMode();
  const [openBox, setOpenBox] = useState(false);

  const getBoxItems = () => {
    switch (currentPage) {
      case PageConstant.HOME:
        return [t("forYou"), t("following"), t("liked"), t("saved")];
      case PageConstant.ACTIVITY:
        return [
          t("all"),
          t("follows"),
          t("replies"),
          t("mentions"),
          t("quotes"),
          t("reposts"),
        ];
      default:
        return [];
    }
  };

  const getHeaderContent = () => {
    const headerContentMap = {
      [PageConstant.HOME]: t("forYou"),
      [PageConstant.ACTIVITY]: t("activity"),
      [PageConstant.FOR_YOU]: t("forYou"),
      [PageConstant.FOLLOWING]: t("following"),
      [PageConstant.LIKED]: t("liked"),
      [PageConstant.SAVED]: t("saved"),
      [PageConstant.SEARCH]: t("search"),
      [PageConstant.USER]: t("userProfile"),
      [PageConstant.FRIEND]: userSelected?.username ?? t("friend"),
      [PageConstant.POST_DETAIL]: t("bread"),
    };

    if (currentPage === PageConstant.HOME) {
      return (
        headerContentMap[PageConstant.HOME][0]?.toUpperCase() +
        headerContentMap[PageConstant.HOME].slice(1)
      );
    } else if (currentPage === PageConstant.ACTIVITY) {
      return (
        headerContentMap[PageConstant.ACTIVITY][0]?.toUpperCase() +
        headerContentMap[PageConstant.ACTIVITY].slice(1)
      );
    }

    return headerContentMap[currentPage] || t("forYou");
  };

  const handleNavigate = (item) => {
    if (currentPage === PageConstant.ACTIVITY) {
      const activityPageMap = {
        [t("all")]: PageConstant.ACTIVITY,
        [t("follows")]: PageConstant.FOLLOWS,
        [t("replies")]: PageConstant.REPLIES,
        [t("mentions")]: PageConstant.MENTIONS,
        [t("quotes")]: PageConstant.QUOTES,
        [t("reposts")]: PageConstant.REPOSTS,
      };
      const targetPage = activityPageMap[item] || item;
      navigate(PageConstant.ACTIVITY + "/" + targetPage);
      dispatch(changeDisplayPageData(targetPage));
    } else {
      const pageMap = {
        [t("forYou")]: PageConstant.FOR_YOU,
        [t("following")]: PageConstant.FOLLOWING,
        [t("liked")]: PageConstant.LIKED,
        [t("saved")]: PageConstant.SAVED,
      };
      const targetPage = pageMap[item] || item;
      navigate("/" + targetPage);
      dispatch(changeDisplayPageData(targetPage));
    }
  };

  return (
    <Flex
      display={"flex"}
      position={"fixed"}
      left={0}
      top={0}
      width={"100vw"}
      maxWidth={"100vw"}
      height={`${HeaderHeight}px`}
      zIndex={999}
      justifyContent={["space-between", "space-between", "center"]}
      alignItems={"center"}
      bg={colorMode === "dark" ? "#0a0a0a" : "#fafafa"}
    >
      <BtnLike />
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
        {[PageConstant.HOME, PageConstant.ACTIVITY].includes(currentPage) && (
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
                    {item[0].toUpperCase() + item.slice(1)}
                  </Text>
                ))}
              </Container>
            )}
          </ClickOutsideComponent>
        )}
      </Flex>
      <BtnMess />
    </Flex>
  );
};

export default memo(Header);
