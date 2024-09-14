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
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { updateProfile } from "../store/UserSlice/asyncThunk";

export default function UpdateProfilePage() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [inputs, setInputs] = useState({
    name: userInfo.name,
    username: userInfo.username,
    email: userInfo.email,
    bio: userInfo.bio,
    password: "",
    profilePicture: userInfo.profilePicture,
  });

  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);

  const { handleImageChange, imgUrl } = usePreviewImg();
  const showToast = useShowToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;

    try {
      dispatch(updateProfile({ ...inputs, profilePicture: imgUrl }));
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

  return (
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
                  src={imgUrl || userInfo.profilePicture}
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
                  onChange={handleImageChange}
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
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="Kang15.8"
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              value={inputs.username}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email </FormLabel>
            <Input
              placeholder="Kang15.8"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              value={inputs.email}
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
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
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
  );
}
