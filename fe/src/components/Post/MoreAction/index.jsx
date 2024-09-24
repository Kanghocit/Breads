import {
  Container,
  Flex,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkSlash, GoReport } from "react-icons/go";
import { IoIosLink } from "react-icons/io";
import { IoBan } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md"; // Correct icons for delete and update
import { useDispatch, useSelector } from "react-redux";
import {
  addPostToCollection,
  removePostFromCollection,
} from "../../../store/UserSlice/asyncThunk";
import useCopyLink from "./CopyLink";
import useDeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import {
  selectPost,
  updatePostAction,
  updatePostInfo,
} from "../../../store/PostSlice";
import PostConstants from "../../../util/PostConstants";

const PostMoreActionBox = ({ post, postId, setOpenPostBox }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const savedBefore = useMemo(() => {
    return userInfo?.collection?.includes(postId);
  }, [userInfo._id]);

  const handleSave = () => {
    const payload = {
      userId: userInfo._id,
      postId: postId,
    };
    if (savedBefore) {
      dispatch(removePostFromCollection(payload));
    } else {
      dispatch(addPostToCollection(payload));
    }
  };

  const { copyURL } = useCopyLink();
  const { handleDeleteClick } = useDeletePost();

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
      onClick: () => {
        copyURL(post);
      },
    },
    ...(userInfo._id === post.authorId
      ? [
          {
            name: "Delete",
            icon: <MdDelete />,
            onClick: () => {
              handleDeleteClick(postId);
            },
          },
          {
            name: "Update",
            icon: <MdEdit />,
            onClick: () => {
              onOpen();
              dispatch(updatePostAction(PostConstants.ACTIONS.EDIT));
              dispatch(updatePostInfo(post));
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Container
        width={"180px"}
        position={"absolute"}
        top={"calc(100% + 12px)"}
        right={"50%"}
        borderRadius={"12px"}
        padding={"12px"}
        bg={colorMode === "dark" ? "#101010" : "gray.100"}
        zIndex={1000}
      >
        {actions.map(({ name, icon, onClick }) => (
          <Flex
            key={name}
            justifyContent={"space-between"}
            height={"36px"}
            cursor={"pointer"}
            alignItems={"center"}
            padding={"0 10px"}
            borderRadius={"8px"}
            _hover={{
              bg: "gray",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
              setOpenPostBox(false);
            }}
          >
            <Text>{name}</Text>
            {icon}
          </Flex>
        ))}
      </Container>
      <UpdatePost isOpen={false} onClose={() => {}} post={post} />
    </>
  );
};

export default PostMoreActionBox;
