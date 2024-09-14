import { Button, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  return (
    <Link to={`/${userInfo._id}`}>
      <Flex w={"full"} justifyContent={"center"}>
        <Button mx={"auto"}>Visit profile page</Button>
      </Flex>
    </Link>
  );
};

export default HomePage;
