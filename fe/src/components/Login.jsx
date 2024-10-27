import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import useShowToast from "../hooks/useShowToast";
import { login } from "../store/UserSlice/asyncThunk";
import { changePage } from "../store/UtilSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [countClick, setCountClick] = useState(0);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const showToast = useShowToast();

  useEffect(() => {
    if (countClick === 5) {
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

  const handleLogin = async () => {
    if (!validateField("email") || !validateField("password")) return;

    try {
      let payload = inputs;
      const result = await dispatch(login(payload)).unwrap();
      showToast("Thành công", "Đăng nhập thành công", "success");
    } catch (error) {
      showToast("Không thành công!", error?.error || "Vui lòng xem lại email hoặc mật khẩu!!", "error");
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
                onChange={(e) => setInputs((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => setInputs((prev) => ({ ...prev, password: e.target.value }))}
                  // onBlur={() => validateField("password")}  
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}
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
                Bạn chưa có tài khoản?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => dispatch(changePage({ nextPage: PageConstant.SIGNUP, currentPage: PageConstant.LOGIN }))}
                >
                  Đăng Ký
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
