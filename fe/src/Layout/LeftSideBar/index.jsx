import { Box, Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { FaFacebookMessenger, FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { MdAdd, MdOutlinePushPin } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { updatePostAction } from "../../store/PostSlice";
import { changeDisplayPageData } from "../../store/UtilSlice";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import PostConstants from "../../util/PostConstants";
import SidebarMenu from "./SidebarMenu";

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);

  const getButtonColor = (isActive, colorMode) => {
    if (isActive) {
      return colorMode === "dark" ? "#f3f5f7" : "#000000";
    }
    return colorMode === "dark" ? "#4d4d4d" : "#a0a0a0";
  };

  const getHoverColor = (colorMode) => {
    return colorMode === "dark" ? "#171717" : "#f0f0f0";
  };

  const listItems = [
    {
      icon: <GrHomeRounded size={24} />,
      linkTo: "/",
      onClick: () => {
        if (currentPage !== PageConstant.HOME) {
          dispatch(changePage({ currentPage, nextPage: PageConstant.HOME }));
          if (displayPageData !== PageConstant.FOR_YOU) {
            dispatch(changeDisplayPageData(PageConstant.FOR_YOU));
          }
        }
        navigate("/");
      },
      color: getButtonColor(currentPage === PageConstant.HOME, colorMode),
    },
    {
      icon: <FiSearch size={24} />,
      linkTo: "/" + PageConstant.SEARCH,
      onClick: () => {
        if (currentPage !== PageConstant.SEARCH) {
          dispatch(changePage({ currentPage, nextPage: PageConstant.SEARCH }));
        }
        navigate("/" + PageConstant.SEARCH);
      },
      color: getButtonColor(currentPage === PageConstant.SEARCH, colorMode),
    },
    {
      icon: <FaRegHeart size={24} />,
      linkTo: "/" + PageConstant.ACTIVITY,
      onClick: () => {
        if (currentPage !== PageConstant.ACTIVITY) {
          dispatch(
            changePage({ currentPage, nextPage: PageConstant.ACTIVITY })
          );
        }
        navigate("/" + PageConstant.ACTIVITY);
      },
      color: getButtonColor(currentPage === PageConstant.ACTIVITY, colorMode),
    },
    {
      icon: <MdAdd size={24} />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
      },
    },
    {
      icon: <FaRegUser size={24} />,
      linkTo: "/" + PageConstant.USER + `/${userInfo._id}`,
      onClick: () => {
        if (currentPage !== PageConstant.USER) {
          dispatch(changePage({ currentPage, nextPage: PageConstant.USER }));
        }
        navigate("/" + PageConstant.USER + `/${userInfo._id}`);
      },
      color: getButtonColor(currentPage === PageConstant.USER, colorMode),
    },
    {
      icon: <FaFacebookMessenger size={24} />,
      linkTo: "/" + PageConstant.CHAT,
      onClick: () => {
        if (currentPage !== PageConstant.CHAT) {
          dispatch(changePage({ currentPage, nextPage: PageConstant.CHAT }));
        }
        navigate("/" + PageConstant.CHAT);
      },
      color: getButtonColor(currentPage === PageConstant.CHAT, colorMode),
    },
  ];

  return (
    <Flex direction={["column", "row"]}>
      <Box
        height={["auto", "auto", "100vh"]}
        color="white"
        p={1}
        position="fixed"
        top={0}
        left={0}
        zIndex={1000}
        display={["none", "none", "block"]}
      >
        <Flex
          alignItems={"center"}
          direction="column"
          justifyContent="space-between"
          height="100%"
          color={colorMode === "dark" ? "white" : "black"}
          position="relative"
        >
          <Link as={RouterLink} to={"/"}>
            <Box m={5}>
              <Image
                cursor={"pointer"}
                alt="logo"
                w={9}
                src={
                  colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"
                }
                onClick={() => {
                  if (currentPage !== PageConstant.HOME) {
                    dispatch(
                      changePage({ currentPage, nextPage: PageConstant.HOME })
                    );
                    if (displayPageData !== PageConstant.FOR_YOU) {
                      dispatch(changeDisplayPageData(PageConstant.FOR_YOU));
                    }
                  }
                  navigate("/");
                }}
              />
            </Box>
          </Link>
          <Flex direction={"column"}>
            {listItems.map((item, index) => (
              <Box my={2} key={`side-bar-item-${index}`}>
                <Button
                  bg="transparent"
                  _hover={{
                    bg: colorMode === "dark" ? "#171717" : "#f0f0f0",
                  }}
                  color={colorMode === "dark" ? "#4d4d4d" : "#a0a0a0"}
                  py={2}
                  px={4}
                  borderRadius="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.linkTo) {
                      e.preventDefault();
                      item.onClick && item.onClick();
                    } else {
                      item.onClick && item.onClick();
                    }
                  }}
                >
                  {item?.linkTo ? (
                    <Link
                      as={RouterLink}
                      to={item.linkTo}
                      borderRadius="md"
                      width={"100%"}
                      height={"100%"}
                      _hover={{ textDecoration: "none" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick && item.onClick();
                      }}
                      color={item.color}
                    >
                      {item.icon}
                    </Link>
                  ) : (
                    <>{item.icon}</>
                  )}
                </Button>
              </Box>
            ))}
            <SidebarMenu />
          </Flex>
          <Flex></Flex>
        </Flex>
      </Box>

      {/* leftsidebar với mobile */}
      <Box
        display={["block", "block", "none"]}
        position="fixed"
        bottom={0}
        width="100%"
        bg={colorMode === "dark" ? "#0a0a0a" : "#ffffff"}
        zIndex={1000}
        py={2}
      >
        <Flex
          justifyContent="space-evenly"
          alignItems="center"
          direction="row"
          width="100%"
        >
          {listItems.map((item, index) => (
            <Box
              key={`side-bar-item-${index}`}
              // mx={3}
            >
              <Button
              p={0}
                bg="transparent"
                _hover={{
                  bg: colorMode === "dark" ? "#171717" : "#f0f0f0",
                }}
                color={item.color}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.linkTo) {
                    e.preventDefault();
                    item.onClick && item.onClick();
                  } else {
                    item.onClick && item.onClick();
                  }
                }}
              >
                {item?.linkTo ? (
                  <Link
                    as={RouterLink}
                    to={item.linkTo}
                    _hover={{ textDecoration: "none" }}
                  >
                    {item.icon}
                  </Link>
                ) : (
                  <>{item.icon}</>
                )}
              </Button>
            </Box>
          ))}
          <SidebarMenu />
        </Flex>
      </Box>
    </Flex>
  );
};

export default LeftSideBar;
