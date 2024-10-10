import {
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  LikeIcon,
  ReplyIcon,
  RepostIcon,
  ShareIcon,
} from "../../../assests/icons";
import {
  selectPost,
  selectPostReply,
  updatePostAction,
} from "../../../store/PostSlice";
import PostConstants from "../../../util/PostConstants";
import { useColorModeValue } from "@chakra-ui/react";
import useCopyLink from "./MoreAction/CopyLink";
import { IoIosLink } from "react-icons/io";
import Socket from "../../../socket";
import { NOTIFICATION_PATH } from "../../../Breads-Shared/APIConfig";

const ACTIONS_NAME = {
  LIKE: "like",
  UNLIKE: "unlike",
  REPLY: "reply",
  REPOST: "repost",
  SHARE: "share",
};

const Actions = ({ post }) => {
  const dispatch = useDispatch();
  const [openSubBox, setOpenSubBox] = useState(false);
  const { copyURL } = useCopyLink();
  const handleLike = () => {
    const socket = Socket.getInstant();
    socket.emitWithAck(NOTIFICATION_PATH.CREATE, "Hello socket");
  };

  const listActions = [
    {
      name: ACTIONS_NAME.LIKE,
      icon: <LikeIcon />,
      onClick: () => {
        handleLike();
      },
    },
    {
      name: ACTIONS_NAME.REPLY,
      icon: <ReplyIcon />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.REPLY));
        dispatch(selectPostReply(post));
      },
    },
    {
      name: ACTIONS_NAME.REPOST,
      icon: <RepostIcon />,
      onClick: () => {
        dispatch(updatePostAction(PostConstants.ACTIONS.REPOST));
        dispatch(selectPost(post));
      },
    },
    {
      name: ACTIONS_NAME.SHARE,
      icon: <ShareIcon />,
      onClick: () => {
        setOpenSubBox(!openSubBox);
      },
    },
  ];

  return (
    <>
      <Flex onClick={(e) => e.preventDefault()} mb={0}>
        {listActions.map(({ name, icon, onClick }, index) => {
          if (name === ACTIONS_NAME.SHARE) {
            return (
              <Popover isOpen={openSubBox} key={name}>
                <PopoverTrigger>
                  <Button
                    onClick={onClick}
                    width={"32px"}
                    height={"32px"}
                    padding={"6px 10px"}
                    bg={"transparent"}
                    borderRadius={"16px"}
                    position={"relative"}
                  >
                    {icon}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  width={"fit-content"}
                  borderRadius={"8px"}
                  bg={useColorModeValue("gray.300", "gray.dark")}
                  padding={"8px 10px"}
                >
                  <PopoverBody
                    cursor={"pointer"}
                    padding={"2px 10px"}
                    borderRadius={"6px"}
                    display={"flex"}
                    gap={"12px"}
                    alignItems={"center"}
                    _hover={{
                      bg: "gray",
                      opacity: "0.7",
                    }}
                    onClick={() => {
                      copyURL(post);
                      setOpenSubBox(false);
                    }}
                  >
                    Copy Link
                    <IoIosLink />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            );
          } else {
            return (
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
            );
          }
        })}
      </Flex>
    </>
  );
};

export default Actions;
