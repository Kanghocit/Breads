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
import PageConstant from "../../util/PageConstants";

const SidebarMenu = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { colorMode, toggleColorMode, setColorMode } = useColorMode();
  const bgk = { bg: "gray.800", color: "white" };

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
        <Menu isOpen={isMenuOpen}>
          <MenuButton as={Box} onClick={handleCloseMenu}>
            <HiMenuAlt4 size={24} />
          </MenuButton>
          <MenuList {...bgk}>
            {menuItems.map((item) => (
              <MenuItem key={item.name} {...item.style} onClick={item.onClick}>
                {item.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
      {isSubMenuOpen && (
        <Menu isOpen={isSubMenuOpen}>
          <MenuButton as={Box} onClick={handleCloseMenu}>
            <HiMenuAlt4 size={24} />
          </MenuButton>
          <MenuList {...bgk} px={2}>
            <MenuItem {...bgk} onClick={() => setIsSubMenuOpen(false)}>
              <FaChevronLeft />
              <Box ml={10}>InterFace</Box>
            </MenuItem>
            <ButtonGroup isAttached mx="auto">
              <Button
                flex={1}
                onClick={() => setColorMode("light")}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
                  outline: "none",
                }}
              >
                <BsBrightnessHigh />
              </Button>
              <Button
                flex={1}
                onClick={() => setColorMode("dark")}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(72, 187, 120, 0.6)",
                  outline: "none",
                }}
              >
                <MdOutlineBrightness2 />
              </Button>
              <Button
                flex={1}
                fontSize={"sm"}
                _focus={{
                  boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.6)",
                  outline: "none",
                }}
              >
                <Box mx={3}>Automatic</Box>
              </Button>
            </ButtonGroup>
          </MenuList>
        </Menu>
      )}
    </Box>
  );
};

export default SidebarMenu;
