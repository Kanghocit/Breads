import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import useShowToast from "../hooks/useShowToast";
import { signUp } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const showToast = useShowToast();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const validateInputs = () => {
    const validationErrors = {};
    const { name, username, email, password } = inputs;

    if (!name) validationErrors.name = "Vui lòng nhập họ và tên!";

    if (!username) validationErrors.username = "Vui lòng nhập tên đăng nhập!";

    if (!email) {
      validationErrors.email = "Vui lòng nhập địa chỉ email!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Địa chỉ email không hợp lệ!";
    }

    if (!password) {
      validationErrors.password = "Vui lòng nhập mật khẩu!";
    } else if (password.length <= 6) {
      validationErrors.password = "Mật khẩu phải dài hơn 6 ký tự!";
    } else if (!/[A-Z]/.test(password)) {
      validationErrors.password =
        "Mật khẩu phải chứa ít nhất một chữ cái viết hoa!";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      validationErrors.password =
        "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!";
    }

    return validationErrors;
  };

  const handleSignup = async () => {
    const validationErrors = validateInputs();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const result = await dispatch(signUp(inputs));

      if (result?.meta?.requestStatus === "fulfilled") {
        showToast("Success", t("signupsuccess"), "success");
        dispatch(
          changePage({
            nextPage: PageConstant.LOGIN,
            currentPage: PageConstant.SIGNUP,
          })
        );
      } else {
        const { errorType, error } = result.payload;

        // Set specific errors based on errorType
        if (errorType === "USERNAME_EXISTS") {
          showToast("Error",  t("usernameexsists"), "error");
        }
        if (errorType === "EMAIL_EXISTS") {
          showToast("Error",  t("emailexsists"), "error");
        }

        
      }
    } catch (error) {
      console.error("Error in handleSignup:", error.message);
      showToast("Error", error.message || t("signupfail"), "error");
    }
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextField?.current?.focus();
    }
  };

  const handleBlur = (field) => {
    if (!inputs[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: `Vui lòng nhập ${
          field === "username"
            ? "tên đăng nhập"
            : field === "name"
            ? "họ và tên"
            : field === "email"
            ? "địa chỉ email"
            : "mật khẩu"
        }!`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (field === "password") {
      const passwordErrors = validateInputs();
      setErrors((prev) => ({
        ...prev,
        password: passwordErrors.password || "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setInputs({ ...inputs, password: newPassword });

    const validationErrors = validateInputs();
    setErrors(validationErrors);
  };

  return (
    <Flex align={"center"} justify={"center"} height="100vh">
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Đăng ký
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack spacing={4}>
              <Box flex="1">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Họ và tên</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    value={inputs.name}
                    onKeyDown={(e) => handleKeyDown(e, usernameRef)}
                    onBlur={() => handleBlur("name")}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl isRequired isInvalid={!!errors.username}>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <Input
                    type="text"
                    ref={usernameRef}
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    value={inputs.username}
                    onKeyDown={(e) => handleKeyDown(e, emailRef)}
                    onBlur={() => handleBlur("username")}
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired isInvalid={!!errors.email}>
              <FormLabel>Địa chỉ email</FormLabel>
              <Input
                type="email"
                ref={emailRef}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                onBlur={() => handleBlur("email")}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isRequired isInvalid={!!errors.password}>
              <FormLabel>Mật khẩu</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  ref={passwordRef}
                  onChange={handlePasswordChange}
                  value={inputs.password}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onBlur={() => handleBlur("password")}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{ bg: useColorModeValue("gray.700", "gray.800") }}
                onClick={handleSignup}
              >
                Đăng Ký
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Đã có tài khoản?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    dispatch(
                      changePage({
                        nextPage: PageConstant.LOGIN,
                        currentPage: PageConstant.SIGNUP,
                      })
                    );
                  }}
                >
                  Đăng nhập
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
