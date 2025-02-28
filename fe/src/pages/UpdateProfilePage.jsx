import {
  Avatar,
  Box,
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
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ChangePWModal from "../components/UpdateUser/changePWModal";
import LinksModal from "../components/UpdateUser/linksModal";
import useShowToast from "../hooks/useShowToast";
import { updateProfile } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent, convertToBase64 } from "../util/index";
import { useTranslation } from "react-i18next";

const POPUP_TYPE = {
  LINKS: "links",
  PW: "pw",
};

const UpdateProfilePage = () => {
  const { t } = useTranslation();
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
      addEvent({
        event: "see_page",
        payload: {
          page: "update_profile",
        },
      });
    }
  }, [userInfo._id]);

  useEffect(() => {
    if (updating && userInfo?._id) {
      showToast("Success", t("updateProfile"), "success");
      dispatch(changePage({ nextPage: PageConstant.USER }));
      navigate(`/users/${userInfo._id}`);
      setUpdating(false);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = JSON.parse(JSON.stringify(inputs));
    //Default links value
    if (payload.links.length === 1 && payload.links[0] === "") {
      payload.links = [];
    }
    const needUpdate = compareUpdateValue(payload);
    if (!needUpdate || updating) {
      showToast("", !needUpdate ? t("nothingtoupdate") : "Loading", "info");
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
      dispatch(updateProfile(payload));
      setUpdating(true);
    } catch (error) {
      showToast(
        "Error",
        error.message || "An unexpected error occurred",
        "error"
      );
    }
  };

  const compareUpdateValue = (payload) => {
    let needUpdate = false;
    if (payload.avatar !== userInfo.avatar) {
      needUpdate = true;
    }
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

  const handleChangeAvatar = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      setInputs({ ...inputs, avatar: base64 });
    } catch (err) {
      console.log("handleChangeAvatar: ", err);
    }
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
              {t("updateProfile.title")}
            </Heading>
            <FormControl id="userName">
              <Stack direction={["column", "row"]} spacing={6}>
                <Center>
                  <Avatar
                    size="xl"
                    boxShadow={"md"}
                    src={inputs.avatar}
                    cursor={"pointer"}
                  />
                </Center>
                <Center w="full">
                  <Button w="full" onClick={() => fileRef.current.click()}>
                    {t("updateProfile.changeAvatar")}
                  </Button>
                  <Input
                    type="file"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) => handleChangeAvatar(e.target.files[0])}
                  />
                </Center>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel>{t("updateProfile.name")}</FormLabel>
              <Input
                placeholder="Your name..."
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                value={inputs.name}
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t("updateProfile.bio")}</FormLabel>
              <Input
                placeholder={t("updateProfile.bio")}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                value={inputs.bio}
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>
            <FormControl>
              <FormLabel>{t("updateProfile.links")}</FormLabel>
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
                  <Text>{t("updateProfile.addLink")}</Text>
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
                {t("updateProfile.changePassword")}
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
                {t("updateProfile.cancel")}
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
                disabled={updating}
                mb={["36px", "36px", 0]}
              >
                {t("updateProfile.confirm")}
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
