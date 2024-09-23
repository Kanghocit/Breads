import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Button,
  MenuDivider,
  ButtonGroup,
  useColorMode,
} from "@chakra-ui/react";
import { HiMenuAlt4 } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import useShowToast from "../../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/UserSlice/asyncThunk";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdOutlineBrightness2 } from "react-icons/md";
import PageConstant from "../../../../share/Constants/PageConstants";
import ClickOutsideComponent from "../../util/ClickoutCPN";

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const bgk = { bg: "gray.dark", color: "100" };

  const menuItems = [
    {
      style: { ...bgk, justifyContent: "space-between" },
      onClick: () => {
        setIsSubMenuOpen(true);
      },
      name: "Interface",
    },
    // {
    //   style: { ...bgk },
    //   onClick: () => {},
    //   name: "Details",
    // },
    {
      style: { ...bgk },
      onClick: () => {
        navigate("/" + PageConstant.SETTING.DEFAULT);
      },
      name: "Setting",
    },
    {
      style: { ...bgk },
      onClick: () => {},
      name: "Report a problem",
    },
    {
      style: { ...bgk },
      onClick: () => {
        handleLogout();
      },
      name: "Log out",
    },
  ];

  const themeBtns = [
    {
      name: "Light",
      icon: <BsBrightnessHigh />,
      boxShadowFocus: "0 0 0 3px rgba(66, 153, 225, 0.6)",
      onClick: () => setColorMode("light"),
    },
    {
      name: "Dark",
      icon: <MdOutlineBrightness2 />,
      boxShadowFocus: "0 0 0 3px rgba(72, 187, 120, 0.6)",
      onClick: () => setColorMode("dark"),
    },
    {
      name: "Automatic",
      boxShadowFocus: "0 0 0 3px rgba(229, 62, 62, 0.6)",
      onClick: () => {},
    },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/auth");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
    setIsSubMenuOpen(false);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setIsSubMenuOpen(false);
  };

  return (
    <Box>
      {!isMenuOpen && (
        <Button onClick={handleMenuOpen} bg={"none"}>
          <HiMenuAlt4 size={24} />
        </Button>
      )}
      {isMenuOpen && !isSubMenuOpen && (
        <ClickOutsideComponent onClose={handleCloseMenu}>
          <Menu isOpen={isMenuOpen}>
            <MenuButton as={Box} onClick={handleCloseMenu}>
              <HiMenuAlt4 size={24} />
            </MenuButton>
            <MenuList
              {...bgk}
              bg={colorMode === "dark" ? "gray.dark" : "gray.100"}
            >
              {menuItems.map((item) => (
                <React.Fragment key={item.name}>
                  {item.name === "Report a problem" && (
                    <MenuDivider _hover={{ bg: "gray.dark" }} />
                  )}
                  <MenuItem
                    {...item.style}
                    onClick={item.onClick}
                    bg={colorMode === "dark" ? "gray.dark" : "gray.white"}
                    color={colorMode === "dark" ? "gray.white" : "gray.dark"}
                    ml={"0.5rem"}
                    width={"calc(100% - 1rem)"}
                    padding={"12px"}
                    _hover={{
                      bg: colorMode === "dark" ? "#2b2b2b" : "gray.200",
                      borderRadius: "md",
                    }}
                  >
                    {item.name === "Interface" ? (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                      >
                        <Box>{item.name}</Box>
                        <FaChevronRight />
                      </Box>
                    ) : (
                      item.name
                    )}
                  </MenuItem>
                </React.Fragment>
              ))}
            </MenuList>
          </Menu>
        </ClickOutsideComponent>
      )}
      {isSubMenuOpen && (
        <ClickOutsideComponent onClose={handleCloseMenu}>
          <Menu isOpen={isSubMenuOpen}>
            <MenuButton as={Box} onClick={handleCloseMenu}>
              <HiMenuAlt4 size={24} />
            </MenuButton>
            <MenuList
              {...bgk}
              bg={colorMode === "dark" ? "gray.dark" : "gray.100"}
              px={3}
            >
              <MenuItem
                {...bgk}
                onClick={() => setIsSubMenuOpen(false)}
                bg={colorMode === "dark" ? "gray.dark" : "gray.100"}
                color={colorMode === "dark" ? "gray.100" : "gray.dark"}
                mb={"4px"}
              >
                <FaChevronLeft />
                <Box width={"100%"} textAlign={"center"}>
                  InterFace
                </Box>
              </MenuItem>
              <ButtonGroup isAttached ml={1}>
                {themeBtns.map((btn) => (
                  <Button
                    key={btn.name}
                    flex={1}
                    onClick={btn.onClick}
                    width={"80px"}
                    _focus={{
                      boxShadow: btn.boxShadowFocus,
                      outline: "none",
                    }}
                  >
                    {btn?.icon ? (
                      btn.icon
                    ) : (
                      <Box
                        boxSizing="border-box"
                        padding={"0 16px"}
                        fontSize={"12px"}
                      >
                        {btn.name}
                      </Box>
                    )}
                  </Button>
                ))}
              </ButtonGroup>
            </MenuList>
          </Menu>
        </ClickOutsideComponent>
      )}
    </Box>
  );
};

export default SidebarMenu;
