import {
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import { IoIosLink } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  LikeIcon,
  ReplyIcon,
  RepostIcon,
  ShareIcon,
} from "../../../assests/icons";
import { POST_PATH, Route } from "../../../Breads-Shared/APIConfig";
import Socket from "../../../socket";
import {
  selectPost,
  selectPostReply,
  updatePostAction,
} from "../../../store/PostSlice";
import PostConstants from "../../../util/PostConstants";
import useCopyLink from "./MoreAction/CopyLink";

const ACTIONS_NAME = {
  LIKE: "like",
  UNLIKE: "unlike",
  REPLY: "reply",
  REPOST: "repost",
  SHARE: "share",
};

const Actions = ({ post }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [openSubBox, setOpenSubBox] = useState(false);
  const { copyURL } = useCopyLink();
  const socket = Socket.getInstant();

  const handleLike = () => {
    const payload = {
      userId: userInfo._id,
      postId: post._id,
    };
    socket.emitWithAck(Route.POST + POST_PATH.LIKE, payload);
  };

  const convertStatistic = (number) => {
    let value = number;
    let strValue = "";
    switch (true) {
      case number >= 1000000:
        value = number / 1000000;
        strValue = "M";
        break;
      case number >= 1000:
        value = number / 1000;
        strValue = "K";
        break;
      default:
        return number;
    }
    const strArr = value.toString().split(".");
    const intValue = strArr[0];
    const firstFloatValue = strArr?.[1]?.[0] ?? "";
    return intValue + (firstFloatValue ? "." + firstFloatValue : "") + strValue;
  };

  const listActions = [
    {
      name: ACTIONS_NAME.LIKE,
      icon: <LikeIcon liked={post.usersLike?.includes(userInfo._id)} />,
      statistic: convertStatistic(post.usersLike?.length),
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
        {listActions.map(({ name, statistic, icon, onClick }, index) => {
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
              <>
                {!!statistic && (
                  <Flex
                    alignItems={"center"}
                    fontSize={"14px"}
                    fontWeight={500}
                  >
                    {statistic}
                  </Flex>
                )}
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
              </>
            );
          }
        })}
      </Flex>
    </>
  );
};

export default memo(Actions);
