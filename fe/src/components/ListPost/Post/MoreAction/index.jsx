import { Container, Flex, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkSlash } from "react-icons/go";
import { IoIosLink } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageConstant from "../../../../Breads-Shared/Constants/PageConstants";
import PostConstants from "../../../../Breads-Shared/Constants/PostConstants";
import useShowToast from "../../../../hooks/useShowToast";
import { updatePostAction, updatePostInfo } from "../../../../store/PostSlice";
import { deletePost } from "../../../../store/PostSlice/asyncThunk";
import {
  addPostToCollection,
  removePostFromCollection,
} from "../../../../store/UserSlice/asyncThunk";
import useCopyLink from "./CopyLink";
import { addEvent } from "../../../../util";

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
  const { t } = useTranslation();
  const savedBefore = userInfo?.collection?.includes(postId);

  const handleSave = () => {
    const payload = {
      userId: userInfo._id,
      postId: postId,
    };
    if (savedBefore) {
      dispatch(removePostFromCollection(payload));
      showToast("", t("unsaved"), "success");
    } else {
      dispatch(addPostToCollection(payload));
      showToast("", t("saved"), "success");
    }
    addEvent({
      event: savedBefore ? "unsave_post" : "save_post",
      payload: {
        postId: postId,
      },
    });
  };

  const handleDelete = () => {
    try {
      addEvent({
        event: "delete_post",
        payload: {
          postId: postId,
        },
      });
      dispatch(deletePost({ postId: postId }));
      closePopupCancel();
      showToast("", t("deletesuccess"), "success");
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
      name: savedBefore ? t("unsave") : t("save"),
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
      name: t("copylink"),
      icon: <IoIosLink />,
      onClick: () => {
        addEvent({
          event: "copy_post_link",
          payload: {
            postId: postId,
          },
        });
        copyURL(post);
      },
    },
    ...(userInfo._id === post.authorId
      ? [
          {
            name: t("delete"),
            icon: <MdDelete />,
            onClick: () => {
              setPopupCancelInfo({
                open: true,
                title: t("delete") + " Bread",
                content: t("wannadelete"),
                leftBtnText: t("updateProfile.cancel"),
                rightBtnText: t("updateProfile.delete"),
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
            name: t("update"),
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
        bg={colorMode === "dark" ? "#1c1e21" : "gray.100"}
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
