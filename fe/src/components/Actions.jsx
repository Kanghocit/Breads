import { Button, Flex } from "@chakra-ui/react";
import { ReplyIcon, LikeIcon, RepostIcon, ShareIcon } from "../assests/icons";
import { useDispatch } from "react-redux";
import { selectPost, updatePostAction } from "../store/PostSlice";
import PostConstants from "../util/PostConstants";

const ACTIONS_NAME = {
  LIKE: "like",
  UNLIKE: "unlike",
  REPLY: "reply",
  REPOST: "repost",
  SHARE: "share",
};

const Actions = ({ post }) => {
  const dispatch = useDispatch();

  const listActions = [
    {
      name: ACTIONS_NAME.LIKE,
      icon: <LikeIcon />,
      onClick: () => {},
    },
    {
      name: ACTIONS_NAME.REPLY,
      icon: <ReplyIcon />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.REPLY));
        dispatch(selectPost(post));
      },
    },
    {
      name: ACTIONS_NAME.REPOST,
      icon: <RepostIcon />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.REPOST));
        let postSelected = JSON.parse(JSON.stringify(post));
        if (postSelected.parentPostInfo) {
          delete postSelected.parentPostInfo;
        }
        dispatch(selectPost(postSelected));
      },
    },
    {
      name: ACTIONS_NAME.SHARE,
      icon: <ShareIcon />,
      onClick: () => {},
    },
  ];

  return (
    <>
      <Flex onClick={(e) => e.preventDefault()} mb={0}>
        {listActions.map(({ name, icon, onClick }, index) => (
          <Button
            key={name}
            onClick={onClick}
            width={"32px"}
            height={"32px"}
            padding={"6px 10px"}
            bg={"transparent"}
            borderRadius={"16px"}
          >
            {icon}
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default Actions;
