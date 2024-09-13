import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { Link as RouterLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { useSelector } from "react-redux";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {!!userInfo._id && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {!!userInfo._id && (
        <Link as={RouterLink} to={`/${userInfo.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}
    </Flex>
  );
};

export default Header;
