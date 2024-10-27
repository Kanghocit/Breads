import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { EmptyContentSvg } from "../assests/icons";
import useShowToast from "../hooks/useShowToast";
import { changeDisplayPageData, updateSeeMedia } from "../store/UtilSlice";
import FollowBtn from "./FollowBtn";

import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import ListPost from "../components/ListPost";
import UserFollowBox from "./UserFollowBox";

import PostConstants from "../util/PostConstants";
import SkeletonPost from "./ListPost/Post/skeleton";
import ConversationBtn from "./ConversationBtn";

const FOLLOW_TAB = {
  FOLLOWED: "followed",
  FOLLOWING: "following",
};

const TABS = {
  Bread: "",
  Replies: PostConstants.ACTIONS.REPLY,
  Reposts: PostConstants.ACTIONS.REPOST,
};

const UserHeader = ({ user, usersFollow, userPosts }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { isLoading } = useSelector((state) => state.post);
  const showToast = useShowToast();
  const [followBox, setFollowBox] = useState({
    open: false,
    currentTab: FOLLOW_TAB.FOLLOWED,
  });

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("", "Profile link copied", "success");
    });
  };

  const handleSeeAvatar = () => {
    dispatch(
      updateSeeMedia({
        open: true,
        media: [
          {
            url: user?.avatar,
            type: "image",
          },
        ],
        currentMediaIndex: 0,
      })
    );
  };

  return (
    <>
      <VStack gap={4} alignItems={"start"} padding={"4px"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"}>{user?.name}</Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user?.username}</Text>
              <Text
                fontSize={"xs"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                KF.net
              </Text>
            </Flex>
          </Box>
          <Box>
            {user?.avatar && (
              <Avatar
                name={user?.name}
                src={user?.avatar}
                size={{
                  base: "md",
                  md: "xl",
                }}
                onClick={() => handleSeeAvatar()}
              />
            )}
            {!user?.avatar && (
              <Avatar
                name={user?.name}
                src="https://bit.ly/broken-link"
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
          </Box>
        </Flex>

        <Text>{user?.bio}</Text>

        {userInfo._id === user?._id && (
          <Link as={RouterLink} to="/update">
            <Button size={"sm"}> Update Profile</Button>
          </Link>
        )}
        {userInfo._id !== user?._id && (
          <Flex width={"100%"} gap={4}>
            <FollowBtn user={user} />
            <ConversationBtn user={user} />
          </Flex>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text
              _hover={{
                textDecoration: "underline",
                cursor: "pointer",
              }}
              color={"gray.light"}
              onClick={() => {
                setFollowBox({
                  ...followBox,
                  open: true,
                });
              }}
            >
              {user?.followed.length} followed
            </Text>
          </Flex>
          <Flex>
            {/* <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box> */}
            {user?._id !== userInfo?._id && (
              <Box className="icon-container">
                <Menu>
                  <MenuButton>
                    <CgMoreO size={24} cursor={"pointer"} />
                  </MenuButton>
                  <Portal>
                    <MenuList bg={"gray.dark"}>
                      <MenuItem bg={"gray.dark"} onClick={copyURL}>
                        Copy link
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Box>
            )}
          </Flex>
        </Flex>

        <Tabs w={"full"}>
          <TabList w={"full"}>
            {Object.keys(TABS).map((key) => (
              <Tab
                flex={1}
                borderBottom={"1.5px solid white"}
                justifyContent={"center"}
                pb={3}
                cursor={"pointer"}
                onClick={() => dispatch(changeDisplayPageData(TABS[key]))}
              >
                <Text fontWeight={"bold"}>{key}</Text>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0} mt={4}>
              {isLoading ? (
                <Flex direction="column" gap={2}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SkeletonPost key={num} />
                  ))}
                </Flex>
              ) : (
                <ListPost posts={userPosts} />
              )}
            </TabPanel>
            <TabPanel p={0} mt={4}>
              {isLoading ? (
                <Flex direction="column" gap={2}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SkeletonPost key={num} />
                  ))}
                </Flex>
              ) : (
                <ListPost posts={userPosts} />
              )}
            </TabPanel>
            <TabPanel p={0} mt={4}>
              {isLoading ? (
                <Flex direction="column" gap={2}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SkeletonPost key={num} />
                  ))}
                </Flex>
              ) : (
                <ListPost posts={userPosts} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <Modal
        isOpen={followBox.open}
        onClose={() => {
          setFollowBox({
            open: false,
            currentTab: FOLLOW_TAB.FOLLOWED,
          });
        }}
      >
        <ModalOverlay />
        <ModalContent overflow={"hidden"}>
          <Tabs>
            <TabList width={"100%"} maxWidth={"100%"}>
              <Tab width={"50%"} textTransform={"capitalize"}>
                <Flex flexDirection={"column"}>
                  <Text>{FOLLOW_TAB.FOLLOWED}</Text>
                  <Text fontSize={"14px"} fontWeight={500}>
                    {usersFollow.followed?.length}
                  </Text>
                </Flex>
              </Tab>
              <Tab width={"50%"} textTransform={"capitalize"}>
                <Flex flexDirection={"column"}>
                  <Text>{FOLLOW_TAB.FOLLOWING}</Text>
                  <Text fontSize={"14px"} fontWeight={500}>
                    {usersFollow.following?.length}
                  </Text>
                </Flex>
              </Tab>
            </TabList>

            <TabPanels padding={0} maxHeight={"85vh"} overflowY={"auto"}>
              <TabPanel padding={0}>
                {usersFollow.followed?.length > 0 ? (
                  usersFollow.followed?.map((user) => (
                    <UserFollowBox
                      user={user}
                      userInfo={user}
                      key={user?._id}
                      inFollowBox={true}
                    />
                  ))
                ) : (
                  <Flex justifyContent={"center"} padding={"16px"}>
                    <EmptyContentSvg />
                  </Flex>
                )}
              </TabPanel>
              <TabPanel padding={0}>
                {usersFollow.following?.length > 0 ? (
                  usersFollow.following?.map((user) => (
                    <UserFollowBox
                      user={user}
                      key={user?._id}
                      inFollowBox={true}
                    />
                  ))
                ) : (
                  <Flex justifyContent={"center"} padding={"16px"}>
                    <EmptyContentSvg />
                  </Flex>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserHeader;
