import { Container, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { IoBan } from "react-icons/io5";
import { GoReport } from "react-icons/go";
import { MdDelete, MdEdit } from "react-icons/md"; // Correct icons for delete and update
import useCopyLink from "./CopyLink";
import useDeletePost from "./DeletePost";
import useUpdatePost from "./UpdatePost"; 
import UpdatePost from "./UpdatePost";

const PostMoreActionBox = ({ user, post }) => {
  const { copyURL } = useCopyLink();
  const { handleDeleteClick } = useDeletePost();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const handleActionClick = (actionName) => {
    switch (actionName) {
      case "Save":
        console.log("Saving post...");
        break;
      case "Block":
        console.log("Blocking user...");
        break;
      case "Report":
        console.log("Reporting post...");
        break;
      case "Copy link":
        copyURL(post);
        break;
      case "Delete":
        handleDeleteClick(post);
        break;
      case "Update":
        onOpen();
        break;
      default:
        break;
    }
  };

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
    ...(user._id === post.authorId
      ? [
          {
            name: "Delete",
            icon: <MdDelete />,
          },
          {
            name: "Update",
            icon: <MdEdit />, 
          },
        ]
      : []),
  ];

  return (
    <>
    <Container width={"100%"} padding={0}>
      {actions.map(({ name, icon }) => (
        <Flex
          key={name}
          justifyContent={"space-between"}
          height={"36px"}
          cursor={"pointer"}
          alignItems={"center"}
          onClick={() => handleActionClick(name)}
        >
          <Text>{name}</Text>
          {icon}
        </Flex>
      ))}
    </Container>
    <UpdatePost isOpen={isOpen} onClose={onClose} post={post} />
    </>
    
  );
};

export default PostMoreActionBox;
