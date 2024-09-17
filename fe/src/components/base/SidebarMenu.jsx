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

const SidebarMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái hiển thị menu chính
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // Trạng thái hiển thị submenu
    const { colorMode, toggleColorMode, setColorMode } = useColorMode(); // Sử dụng useColorMode để quản lý chế độ màu
    const bgk = { bg: "gray.800", color: "white" }; // Thiết lập màu nền và màu chữ mặc định
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleLogout = async () => {
        try {
            dispatch(logout());
            navigate("/auth"); // Điều hướng về trang xác thực sau khi đăng xuất
        } catch (error) {
            showToast("Error", error.message, "error"); // Hiển thị lỗi khi không thể đăng xuất
        }
    };

    // Mở menu chính
    const handleMenuOpen = () => {
        setIsMenuOpen(true);
        setIsSubMenuOpen(false); // Đảm bảo submenu không hiển thị khi mở menu chính
    };

    // Mở submenu khi bấm vào "InterFace"
    const handleSubMenuOpen = () => {
        setIsSubMenuOpen(true);
    };

    // Quay lại menu chính từ submenu
    const handleBackToMainMenu = () => {
        setIsSubMenuOpen(false);
    };

    // Đóng cả menu và submenu (hiển thị lại icon)
    const handleCloseMenu = () => {
        setIsMenuOpen(false);
        setIsSubMenuOpen(false);
    };

    return (
        <Box>
            {/* Button Icon: Hiển thị icon */}
            {!isMenuOpen && (
                <Button onClick={handleMenuOpen} bg={"none"}>
                    <HiMenuAlt4 size={24} />
                </Button>
            )}

            {/* Menu chính */}
            {isMenuOpen && !isSubMenuOpen && (
                <Menu isOpen={isMenuOpen}>
                    <MenuButton as={Box} onClick={handleCloseMenu}>
                        <HiMenuAlt4 size={24} />
                    </MenuButton>
                    <MenuList {...bgk}>
                        <MenuItem
                            {...bgk}
                            justifyContent="space-between"
                            onClick={handleSubMenuOpen} // Khi bấm vào, mở submenu
                        >
                            InterFace
                            <FaChevronRight />
                        </MenuItem>
                        <MenuItem {...bgk}>Details</MenuItem>
                        <MenuItem {...bgk}>Setting</MenuItem>
                        <MenuDivider />
                        <MenuItem {...bgk}>Report a problem</MenuItem>
                        <MenuItem {...bgk} onClick={handleLogout}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            )}

            {/* Submenu */}
            {isSubMenuOpen && (
                <Menu isOpen={isSubMenuOpen}>
                    <MenuButton as={Box} onClick={handleCloseMenu}>
                        <HiMenuAlt4 size={24} />
                    </MenuButton>
                    <MenuList {...bgk} px={2}>
                        <MenuItem {...bgk} onClick={handleBackToMainMenu}>
                            <FaChevronLeft />
                            <Box ml={10}>InterFace</Box>
                        </MenuItem>

                        {/* Nút để chuyển màu */}
                        <ButtonGroup isAttached mx="auto">
                            <Button
                                flex={1}
                                onClick={() => setColorMode("light")} // Chuyển màu sáng khi nhấn
                                _focus={{
                                    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)', // Tùy chỉnh shadow khi focus
                                    outline: 'none'
                                }}
                            >
                                <BsBrightnessHigh />
                            </Button>
                            <Button
                                flex={1}
                                onClick={() => setColorMode("dark")} // Chuyển màu tối khi nhấn
                                _focus={{
                                    boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.6)', // Tùy chỉnh shadow khi focus
                                    outline: 'none'
                                }}
                            >
                                <MdOutlineBrightness2 />
                            </Button>
                            <Button
                                flex={1}
                                fontSize={"sm"}
                                _focus={{
                                    boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.6)', // Tùy chỉnh shadow khi focus
                                    outline: 'none'
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
