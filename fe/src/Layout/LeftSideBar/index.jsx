import { Box, Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { BiSolidHome } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MdAdd, MdOutlinePushPin } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { updatePostAction } from "../../store/PostSlice";
import PageConstant from "../../util/PageConstants";
import PostConstants from "../../util/PostConstants";
import SidebarMenu from "./SidebarMenu";
import { changePage } from "../../store/UtilSlice";

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentPage = useSelector((state) => state.util.currentPage);
  let bgk = { bg: "gray.dark" };

  const listItems = [
    {
      icon: <BiSolidHome size={24} />,
      linkTo: "/",
      onClick: () => {
        dispatch(changePage({ currentPage, nextPage: PageConstant.HOME }));
      },
    },
    {
      icon: <FiSearch size={24} />,
      linkTo: "/" + PageConstant.SEARCH,
      onClick: () => {
        dispatch(changePage({ currentPage, nextPage: PageConstant.SEARCH }));
      },
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
        dispatch(changePage({ currentPage, nextPage: PageConstant.ACTIVITY }));
      },
    },
    {
      icon: <FaRegUser size={24} />,
      linkTo: "/" + PageConstant.USER + `/${userInfo._id}`,
      onClick: () => {
        dispatch(changePage({ currentPage, nextPage: PageConstant.USER }));
      },
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
          zIndex={2000}
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
                />
              </Box>
            </Link>
            <Flex direction={"column"}>
              {listItems.map((item, index) => (
                <Box my={3} key={`side-bar-item-${index}`}>
                  <Button
                    bg="transparent"
                    _hover={{ bg: "gray.dark" }}
                    py={2}
                    px={4}
                    borderRadius="md"
                    onClick={() => {
                      item.onClick && item.onClick();
                    }}
                  >
                    {item?.linkTo ? (
                      <Link
                        as={RouterLink}
                        to={item.linkTo}
                        _hover={{ textDecoration: "none", bg: "gray.dark" }}
                        borderRadius="md"
                        width={"100%"}
                        height={"100%"}
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
              <Button mb={3} mt={7} bg={"none"}>
                <Link as={RouterLink} to={`/`}>
                  <MdOutlinePushPin size={24} />
                </Link>
              </Button>
              <Button mb={7} mt={3} bg={"none"} _hover={"none"}>
                <SidebarMenu />
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default LeftSideBar;
