import { Container, Flex, Text, useColorMode } from "@chakra-ui/react";
import { useMemo } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkSlash, GoReport } from "react-icons/go";
import { IoIosLink } from "react-icons/io";
import { IoBan } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md"; // Correct icons for delete and update
import { useDispatch, useSelector } from "react-redux";
import useShowToast from "../../../hooks/useShowToast";
import { updatePostAction, updatePostInfo } from "../../../store/PostSlice";
import { deletePost } from "../../../store/PostSlice/asyncThunk";
import {
  addPostToCollection,
  removePostFromCollection,
} from "../../../store/UserSlice/asyncThunk";
import PostConstants from "../../../util/PostConstants";
import useCopyLink from "./CopyLink";
import { useNavigate } from "react-router-dom";
import PageConstant from "../../../../../share/Constants/PageConstants";

const PostMoreActionBox = ({
  post,
  postId,
  setOpenPostBox,
  setPopupCancelInfo,
  closePopupCancel,
}) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const postSelected = useSelector((state) => state.post.postSelected);
  const currentPage = useSelector((state) => state.util.currentPage);
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const showToast = useShowToast();
  const { copyURL } = useCopyLink();
  const savedBefore = useMemo(() => {
    return userInfo?.collecOtion?.includes(postId);
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

  const handleDelete = () => {
    try {
      dispatch(deletePost({ postId: postId }));
      closePopupCancel();
      showToast("", "Delete success", "success");
      if (
        postId === postSelected?._id &&
        currentPage === PageConstant.POST_DETAIL
      ) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      showToast("", err, "error");
    }
  };

  const actions = [
    {
      name: savedBefore ? "Unsave" : "Save",
      icon: savedBefore ? <GoBookmarkSlash /> : <CiBookmark />,
      onClick: handleSave,
    },
    // {
    //   name: "Block",
    //   icon: <IoBan />,
    // },
    // {
    //   name: "Report",
    //   icon: <GoReport />,
    // },
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
              setPopupCancelInfo({
                open: true,
                title: "Delete Bread",
                content: `Do you want to delete this bread ?`,
                leftBtnText: "Cancel",
                rightBtnText: "Delete",
                leftBtnAction: () => {
                  closePopupCancel();
                },
                rightBtnAction: () => {
                  handleDelete();
                },
                rightBtnStyle: {
                  color: "red",
                },
              });
            },
          },
          {
            name: "Update",
            icon: <MdEdit />,
            onClick: () => {
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
    </>
  );
};

export default PostMoreActionBox;
