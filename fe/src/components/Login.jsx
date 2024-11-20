import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, USER_PATH, UTIL_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { encodedString } from "../Breads-Shared/util";
import { POST } from "../config/API";
import useShowToast from "../hooks/useShowToast";
import { login } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { genRandomCode } from "../util/index";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const codeSend = useRef(genRandomCode());
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [countClick, setCountClick] = useState(0);
  const [openCodeBox, setOpenCodeBox] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const showToast = useShowToast();

  useEffect(() => {
    if (countClick >= 5) {
      handleLogin(true);
    }
  }, [countClick]);

  const validateField = (fieldName) => {
    const newErrors = { ...errors };
    const { email, password } = inputs;

    if (fieldName === "email") {
      if (!email) {
        newErrors.email = "Email là bắt buộc.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email không hợp lệ.";
      } else {
        delete newErrors.email;
      }
    }

    if (fieldName === "password") {
      if (!password) {
        newErrors.password = "Mật khẩu là bắt buộc.";
      } else if (password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      }
      // else if (!/[A-Z]/.test(password)) {
      //   newErrors.password = "Mật khẩu phải chứa ít nhất một chữ cái hoa.";
      // } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      //   newErrors.password = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
      // } else {
      //   delete newErrors.password;
      // }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (loginAsAdmin) => {
    let payload = inputs;
    if (loginAsAdmin) {
      payload.loginAsAdmin = true;
      dispatch(login(payload));
      showToast("Thành công", "Đăng nhập bằng Admin thành công", "success");
      return;
    }
    if (!validateField("email") || !validateField("password")) return;

    try {
      await dispatch(login(payload)).unwrap();
      showToast("Thành công", "Đăng nhập thành công", "success");
    } catch (error) {
      showToast(
        "Không thành công!",
        error?.error || "Vui lòng xem lại email hoặc mật khẩu!!",
        "error"
      );
    }
  };

  const handleForgotPassword = async () => {
    try {
      const email = inputs.email;
      if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
        let isValidAccount = await POST({
          path: Route.USER + USER_PATH.CHECK_VALID_USER,
          payload: {
            userEmail: email,
          },
        });
        if (isValidAccount) {
          showToast("", "Code send", "success");
          console.log("code: ", codeSend.current);
          const codeSendDecoded = encodedString(codeSend.current);
          try {
            const options = {
              from: "mraducky@gmail.com",
              to: email,
              subject: "Reset password",
              code: codeSendDecoded,
              url: `${window.location.origin}/reset-pw/userId/${codeSendDecoded}`,
            };
            localStorage.setItem("encodedCode", codeSendDecoded);
            await POST({
              path: Route.UTIL + UTIL_PATH.SEND_FORGOT_PW_MAIL,
              payload: options,
            });
            setOpenCodeBox(true);
          } catch (err) {
            console.error(err);
          }
        } else {
          showToast("", "Invalid account", "error");
        }
      } else {
        showToast("", "Invalid email", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error", "Server error", "error");
    }
  };

  const handleSubmitCode = async () => {
    try {
      if (code === codeSend.current) {
        const userId = await POST({
          path: Route.USER + USER_PATH.GET_USER_ID_FROM_EMAIL,
          payload: {
            userEmail: inputs.email,
          },
        });
        navigate(`/reset-pw/${userId}/${code}`);
      } else {
        showToast("", "Wrong code", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} my={6}>
        <Stack align={"center"}>
          <Heading
            fontSize={"4xl"}
            textAlign={"center"}
            onClick={() => setCountClick((prev) => prev + 1)}
          >
            Đăng Nhập
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{ base: "full", sm: "400px" }}
        >
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, email: e.target.value }))
                }
                onBlur={() => validateField("email")}
                value={inputs.email}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!!errors.password}>
              <FormLabel>Mật Khẩu</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  // onBlur={() => validateField("password")}
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Đang gửi"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{ bg: useColorModeValue("gray.700", "gray.800") }}
                onClick={() => handleLogin()}
              >
                Đăng Nhập
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    handleForgotPassword();
                  }}
                >
                  Forgot password
                </Link>
              </Text>
              <Text align={"center"}>
                Bạn chưa có tài khoản?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() =>
                    dispatch(
                      changePage({
                        nextPage: PageConstant.SIGNUP,
                        currentPage: PageConstant.LOGIN,
                      })
                    )
                  }
                >
                  Đăng Ký
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      <Modal isOpen={openCodeBox} onClose={() => setOpenCodeBox(false)}>
        <ModalOverlay />
        <ModalContent w={"320px"} borderRadius={"10px"}>
          <ModalBody
            pb={6}
            bg={useColorModeValue("white", "gray.dark")}
            border={`1px solid ${useColorModeValue("gray.dark", "white")}`}
            borderRadius={6}
          >
            <Flex flexDir={"column"}>
              <Text textAlign={"center"} fontWeight={600} fontSize={18} py={3}>
                Forgot code validation
              </Text>
              <Text fontSize={14}>
                Type the code sent to your email to change your password
              </Text>
              <Input
                placeholder="Type your code here ..."
                my={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button onClick={() => handleSubmitCode()}>Submit</Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Login;
