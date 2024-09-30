import {
  Avatar,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangePWModal from "../components/UpdateUser/changePWModal";
import LinksModal from "../components/UpdateUser/linksModal";
import useShowToast from "../hooks/useShowToast";
import { updateProfile } from "../store/UserSlice/asyncThunk";
import { updateSeeMedia } from "../store/UtilSlice";
import { convertToBase64 } from "../util/index";

const POPUP_TYPE = {
  LINKS: "links",
  PW: "pw",
};

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [inputs, setInputs] = useState({
    name: "",
    bio: "",
    links: [""],
    avatar: "",
  });
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "",
  });
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  useEffect(() => {
    if (userInfo._id) {
      setInputs({
        name: userInfo.name,
        bio: userInfo.bio,
        links: userInfo.links ?? [""],
        avatar: userInfo.avatar,
      });
    }
  }, [userInfo._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = JSON.parse(JSON.stringify(inputs));
    //Default links value
    if (payload.links.length === 1 && payload.links[0] === "") {
      payload.links = [];
    }
    const needUpdate = compareUpdateValue(payload);
    if (!needUpdate || updating) {
      showToast(
        "",
        !needUpdate ? "There is nothing new to update" : "Loading",
        "info"
      );
      return;
    }
    for (let key of Object.keys(payload)) {
      const msg = payloadValidation(payload, key);
      if (msg) {
        showToast("", msg, "error");
        return;
      }
    }
    try {
      if (typeof payload.avatar === "object") {
        payload.avatar = await convertToBase64(payload.avatar);
      }
      dispatch(updateProfile(payload));
      showToast("Success", "Profile updated successfully", "success");
    } catch (error) {
      showToast(
        "Error",
        error.message || "An unexpected error occurred",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  const compareUpdateValue = (payload) => {
    let needUpdate = false;
    if (payload.name !== userInfo.name) {
      needUpdate = true;
    } else if (payload.bio !== userInfo.bio) {
      needUpdate = true;
    } else {
      if (payload.links.length !== userInfo.links.length) {
        needUpdate = true;
      } else {
        const isSameLinks = payload.links.every(
          (link, index) => link === userInfo.links[index]
        );
        if (!isSameLinks) {
          needUpdate = true;
        }
      }
    }
    return needUpdate;
  };

  const payloadValidation = (payload, prop) => {
    switch (prop) {
      case "name":
        if (!payload[prop].trim()) {
          return "Empty name";
        }
        break;
      case "links":
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        for (const link of payload.links) {
          const isUrl = link.match(urlRegex)?.length > 0;
          if (!isUrl) {
            return "Invalid link value";
          }
        }
        break;
    }
    return "";
  };

  const handleDeleteLink = (linkIndex) => {
    if (inputs.links.length > 1) {
      const newLinks = inputs.links.filter((_, index) => index !== linkIndex);
      setInputs({
        ...inputs,
        links: newLinks,
      });
    } else if (inputs.links.length === 1) {
      setInputs({
        ...inputs,
        links: [""],
      });
    }
  };

  const handleAddMoreLink = () => {
    setInputs({
      ...inputs,
      links: [...inputs.links, ""],
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex align={"center"} justify={"center"}>
          <Stack
            spacing={4}
            w={"full"}
            maxW={"md"}
            bg={useColorModeValue("white", "gray.dark")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
              User Profile Edit
            </Heading>
            <FormControl id="userName">
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar
                    size="xl"
                    boxShadow={"md"}
                    src={
                      typeof inputs.avatar === "string"
                        ? inputs.avatar
                        : URL.createObjectURL(inputs.avatar)
                    }
                    cursor={"pointer"}
                    onClick={() => {
                      dispatch(
                        updateSeeMedia({
                          open: true,
                          img: userInfo.avatar,
                        })
                      );
                    }}
                  />
                </Center>
                <Center w="full">
                  <Button w="full" onClick={() => fileRef.current.click()}>
                    Change Avatar
                  </Button>
                  <Input
                    type="file"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) =>
                      setInputs({ ...inputs, avatar: e.target.files[0] })
                    }
                  />
                </Center>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>FullName</FormLabel>
              <Input
                placeholder="An Khang"
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                value={inputs.name}
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Input
                placeholder="Your bio..."
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                value={inputs.bio}
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Links</FormLabel>
              <Flex
                width={"100%"}
                height={"fit-content"}
                minHeight={"40px"}
                border={"1px solid lightgray"}
                borderRadius={"6px"}
                alignItems={"center"}
                padding={"10px 16px"}
                flexWrap={"wrap"}
                gap={"6px"}
                onClick={() =>
                  setPopup({
                    isOpen: true,
                    type: POPUP_TYPE.LINKS,
                  })
                }
              >
                {inputs.links.length === 1 && inputs.links[0] === "" ? (
                  <Text>Your links</Text>
                ) : (
                  <>
                    {inputs.links.map((link, index) => {
                      if (link.trim()) {
                        return (
                          <Tag
                            size={"lg"}
                            key={link + index}
                            borderRadius="full"
                            variant="solid"
                            colorScheme="blue"
                          >
                            <TagLabel>{link}</TagLabel>
                            <TagCloseButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLink(index);
                              }}
                            />
                          </Tag>
                        );
                      }
                    })}
                  </>
                )}
              </Flex>
            </FormControl>
            <FormControl>
              <Button
                width={"100%"}
                onClick={() =>
                  setPopup({
                    isOpen: true,
                    type: POPUP_TYPE.PW,
                  })
                }
              >
                Change Password
              </Button>
            </FormControl>
            <Stack spacing={6} direction={["column", "row"]}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
                type="submit"
                isLoading={updating}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </form>
      {popup.isOpen && (
        <>
          {popup.type === POPUP_TYPE.LINKS ? (
            <LinksModal
              inputs={inputs}
              setInputs={setInputs}
              setPopup={setPopup}
              handleDeleteLink={handleDeleteLink}
              handleAddMoreLink={handleAddMoreLink}
            />
          ) : (
            <ChangePWModal setPopup={setPopup} />
          )}
        </>
      )}
    </>
  );
};

export default UpdateProfilePage;
