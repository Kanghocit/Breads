import { Box, Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { MdAdd, MdOutlinePushPin } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { updatePostAction } from "../../store/PostSlice";
import { changeDisplayPageData, changePage } from "../../store/UtilSlice";
import { FaFacebookMessenger } from "react-icons/fa";
import PostConstants from "../../util/PostConstants";
import SidebarMenu from "./SidebarMenu";

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector((state) => state.util);
  let bgk = { bg: "gray.dark" };

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
      color:
        currentPage === PageConstant.HOME
          ? colorMode === "dark"
            ? "#f3f5f7"
            : "#000000"
          : undefined,
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
      color:
        currentPage === PageConstant.SEARCH
          ? colorMode === "dark"
            ? "#f3f5f7"
            : "#000000"
          : undefined,
    },
    {
      icon: <MdAdd size={24} />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
      },
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
      color:
        currentPage === PageConstant.ACTIVITY
          ? colorMode === "dark"
            ? "#f3f5f7"
            : "#000000"
          : undefined,
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
      color:
        currentPage === PageConstant.USER
          ? colorMode === "dark"
            ? "#f3f5f7"
            : "#000000"
          : undefined,
    },
    {
      icon: <FaFacebookMessenger size={24}/>,
      linkTo: "/" + PageConstant.CHAT ,
      onClick: () => {
        if (currentPage !== PageConstant.CHAT) {
          dispatch(changePage({ currentPage, nextPage: PageConstant.CHAT}));
        }
        navigate("/" + PageConstant.CHAT );
      },
      color:
        currentPage === PageConstant.CHAT
          ? colorMode === "dark"
            ? "#f3f5f7"
            : "#000000"
          : undefined,
    },
  ];

  return (
    <>
      <Flex>
        <Box
          height="100vh"
          color="white"
          p={1}
          position="fixed"
          top={0}
          left={0}
          zIndex={1000}
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
                <Box my={3} key={`side-bar-item-${index}`}>
                  <Button
                    bg="transparent"
                    _hover={{
                      bg: colorMode === "dark" ? "#171717" : "#f0f0f0",
                    }}
                    // _focus={{
                    //   color: colorMode === "dark" ? "#f3f5f7" : "#000000",
                    // }}
                    color={colorMode === "dark" ? "#4d4d4d" : "#a0a0a0"}
                    py={2}
                    px={4}
                    borderRadius="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick && !item?.linkTo && item.onClick();
                    }}
                  >
                    {item?.linkTo ? (
                      <Link
                        as={RouterLink}
                        to={item.linkTo}
                        borderRadius="md"
                        width={"100%"}
                        height={"100%"}
                        onClick={(e) => {
                          e.preventDefault();
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
            </Flex>
            <Flex direction={"column"}>
              <Box bottom={0}>
                <Button
                  mt={7}
                  mb={3}
                  bg={"none"}
                  color={colorMode === "dark" ? "#4d4d4d" : "#a0a0a0"}
                  _hover={{
                    color: colorMode === "dark" ? "#f3f5f7" : "#000000",
                  }}
                >
                  <Link as={RouterLink} to={`/`}>
                    <MdOutlinePushPin size={24} />
                  </Link>
                </Button>
                <Box
                  mt={3}
                  mb={7}
                  bg={"none"}
                  _hover={{ bg: "none" }}
                  display="flex"
                  justifyContent="center"
                  height="24px"
                  alignItems="center"
                >
                  <SidebarMenu />
                </Box>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default LeftSideBar;
