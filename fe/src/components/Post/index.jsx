import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Image,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import Actions from "../Actions";
import PostMoreActionBox from "./MoreAction";
import { updateSeeMedia } from "../../store/UtilSlice";
import { selectPost } from "../../store/PostSlice";

const Post = ({ post, isDetail }) => {
  //Temp
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [liked, setLiked] = useState(false);
  const [openPostBox, setOpenPostBox] = useState(false);

  const handleSeeDetail = () => {
    window.open(`/post/${1}`, "_self");
  };

  const handleSeeFullMedia = () => {
    dispatch(
      updateSeeMedia({
        open: true,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe5i-QQvQDL1IvfiSWYovid0R8ZFbtGKhuBA&s",
      })
    );
    //Temp
    dispatch(
      selectPost({
        _id: "abc",
      })
    );
  };

  return (
    <Card>
      <CardBody>
        <Flex justifyContent={"space-between"}>
          <Link as={RouterLink} to={`/user/${userInfo._id}`}>
            <Flex w={"full"} alignItems={"center"} gap={3}>
              <Avatar
                src="/kang-avatar.png"
                size={"md"}
                name="kang15.8"
                cursor={"pointer"}
              />
              <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"} cursor={"pointer"}>
                  An Khang
                </Text>
                <Image src="/verified.png" w="4" h={4} ml={4} />
              </Flex>
            </Flex>
          </Link>

          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              1d
            </Text>
            <Popover>
              <PopoverTrigger>
                <Button
                  bg={"transparent"}
                  borderRadius={"50%"}
                  width={"32px"}
                  height={"40px"}
                  padding={"0"}
                >
                  <BsThreeDots onClick={() => setOpenPostBox(!openPostBox)} />
                </Button>
              </PopoverTrigger>
              <PopoverContent width={"180px"}>
                <PopoverBody width={"180px"}>
                  <PostMoreActionBox />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <Text my={3} cursor={"pointer"} onClick={() => handleSeeDetail()}>
          Let's talk about KF
        </Text>
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
          cursor={"pointer"}
          onClick={() => handleSeeFullMedia()}
        >
          <Image src="/post1.png" w={"full"} />
        </Box>

        <Flex gap={3} my={3}>
          <Actions liked={liked} setLiked={setLiked} />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Post;
