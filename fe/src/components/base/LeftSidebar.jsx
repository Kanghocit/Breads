import { Box, Button, Flex, Image, Link, useColorMode, useDisclosure } from '@chakra-ui/react'

import { FiSearch } from "react-icons/fi";
import { BiSolidHome } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { useSelector } from 'react-redux';
import { Link as RouterLink } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlinePushPin } from "react-icons/md";


import CreatePostModal from './CreatePostModal';
import SidebarMenu from './SidebarMenu';





const LeftSideBar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    
    const userInfo = useSelector((state) => state.user.userInfo);
    const { isOpen, onOpen, onClose } = useDisclosure();
    let bgk = { bg: "gray.dark" }


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
                >
                    <Flex
                        alignItems={"center"}
                        direction="column"
                        justifyContent="space-between" // Dàn đều các phần tử con ra theo chiều dọc
                        height="100%"
                        color={colorMode === "dark" ? "white" : "black"}
                        position="relative"
                    >
                        {/* Logo section */}
                        <Box m={5}>
                            <Image

                                cursor={"pointer"}
                                alt="logo"
                                w={9}
                                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                                
                            />
                        </Box>

                        {/* Main icon section */}
                        <Flex direction={"column"}>
                            <Box my={3}>
                                <Button bg="transparent"
                                    _hover={{ bg: "gray.dark" }} // Background khi hover
                                    py={2}
                                    px={4}
                                    borderRadius="md">
                                    <Link as={RouterLink} to="/">
                                        <BiSolidHome size={24} />
                                    </Link>
                                </Button>
                            </Box>
                            <Box my={3}>
                                <Button bg="transparent"
                                    _hover={{ bg: "gray.dark" }} // Background khi hover
                                    py={2}
                                    px={4}
                                    borderRadius="md">
                                    <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none', bg: 'gray.dark' }} borderRadius="md">
                                        <FiSearch size={24} />
                                    </Link>
                                </Button>
                            </Box>
                            <Box my={3}>
                                <Button bg="transparent"

                                    py={2}
                                    px={4}
                                    borderRadius="md"
                                    onClick={onOpen}
                                    _hover={{ textDecoration: 'none', bg: 'gray.dark' }}
                                >
                                    <MdAdd size={24} />

                                </Button>
                            </Box>
                            <Box my={3}>
                                <Button bg="transparent"
                                    _hover={{ bg: "gray.dark" }} // Background khi hover
                                    py={2}
                                    px={4}
                                    borderRadius="md">
                                    <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none', bg: 'gray.dark' }} borderRadius="md">
                                        <FaRegHeart size={24} />
                                    </Link>
                                </Button>
                            </Box>
                            <Box my={3}>
                                <Button bg="transparent"
                                    _hover={{ bg: "gray.dark" }} // Background khi hover
                                    py={2}
                                    px={4}
                                    borderRadius="md">
                                    <Link as={RouterLink} to={`/user/${userInfo._id}`}>
                                        <FaRegUser size={24} />
                                    </Link>
                                </Button>
                            </Box>
                        </Flex>

                        {/* Secondary icon section */}
                        <Flex direction={"column"}>
                            <Button mb={3} mt={7} bg={"none"}>
                                <Link as={RouterLink} to={`/`}>
                                    <MdOutlinePushPin size={24} />
                                </Link>
                            </Button>
                            <Button mb={7} mt={3} bg={"none"} _hover={"none"} >
                                {/* Sử dụng SidebarMenu */}
                                <SidebarMenu />
                            </Button>

                        </Flex>
                    </Flex>
                </Box >

                {/* Main content area */}
                < Box ml="250px" p={4} >
                    <h1>Main Content</h1>
                    <p>This is the main content area.</p>
                </Box >
                <CreatePostModal isOpen={isOpen} onClose={onClose} />
            </Flex >

        </>
    )
}

export default LeftSideBar