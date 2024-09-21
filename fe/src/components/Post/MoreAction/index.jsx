import { Container, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkSlash, GoReport } from "react-icons/go";
import { IoIosLink } from "react-icons/io";
import { IoBan } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostToCollection,
  removePostFromCollection,
} from "../../../store/UserSlice/asyncThunk";

const PostMoreActionBox = ({ postId, setOpenPostBox }) => {
  console.log("hello");
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const savedBefore = useMemo(() => {
    return userInfo.collection.includes(postId);
  }, [userInfo._id]);

  const handleSave = () => {
    const payload = {
      userId: userInfo._id,
      postId: postId,
    };
    if (savedBefore) {
      dispatch(removePostFromCollection(payload));
      s;
    } else {
      dispatch(addPostToCollection(payload));
    }
  };

  const actions = [
    {
      name: savedBefore ? "Unsave" : "Save",
      icon: savedBefore ? <GoBookmarkSlash /> : <CiBookmark />,
      onClick: handleSave,
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
    <Container width={"180px"} padding={0}>
      {actions.map(({ name, icon, onClick }) => (
        <Flex
          key={name}
          justifyContent={"space-between"}
          height={"36px"}
          cursor={"pointer"}
          alignItems={"center"}
          padding={"0 10px"}
          borderRadius={"8px"}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
            setOpenPostBox(false);
          }}
          _hover={{
            bg: "gray",
          }}
        >
          <Text>{name}</Text>
          {icon}
        </Flex>
      ))}
    </Container>
  );
};

export default PostMoreActionBox;
