import { Box, Container, Flex, Text } from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { IoBan } from "react-icons/io5";
import { GoReport } from "react-icons/go";

const PostMoreActionBox = () => {
  const actions = [
    {
      name: "Save",
      icon: <CiBookmark />,
    },
    {
      name: "Block",
      icon: <IoBan />,
    },
    {
      name: "Report",
      icon: <GoReport />,
    },
    {
      name: "Copy link",
      icon: <IoIosLink />,
    },
  ];
  return (
    <Container width={"100%"} padding={0}>
      {actions.map(({ name, icon }) => (
        <Flex
          key={name}
          justifyContent={"space-between"}
          height={"36px"}
          cursor={"pointer"}
          alignItems={"center"}
        >
          <Text>{name}</Text>
          {icon}
        </Flex>
      ))}
    </Container>
  );
};

export default PostMoreActionBox;
