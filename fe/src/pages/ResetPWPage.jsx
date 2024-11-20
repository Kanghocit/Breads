import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { decodeString } from "../Breads-Shared/util";
import useShowToast from "../hooks/useShowToast";
import { changePage } from "../store/UtilSlice/asyncThunk";
import ErrorPage from "./ErrorPage";
import { handleUpdatePW } from "../components/UpdateUser/changePWModal";

const ResetPWPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { userId, code } = useParams();
  const encodedCode = localStorage.getItem("encodedCode");
  const isTrueCode = decodeString(encodedCode) === code;
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
    passwordsMatch: true,
  });

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.RESET_PW }));
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async () => {
    const { password, confirmPassword } = passwordData;
    if (password === confirmPassword) {
      setPasswordData({ ...passwordData, passwordsMatch: true });
      await handleUpdatePW({
        currentPWValue: "",
        newPWValue: passwordData.password,
        userId: userId,
        forgotPW: true,
        showToast: showToast,
        endAction: () => {
          setTimeout(() => {
            navigate("/");
            localStorage.setItem("userId", userId);
            localStorage.removeItem("encodedCode");
          }, 1500);
        },
      });
    } else {
      setPasswordData({ ...passwordData, passwordsMatch: false });
    }
  };

  return (
    <>
      {isTrueCode ? (
        <Flex
          w={"100vw"}
          h={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <div className="register-right">
            <Text
              variant="h5"
              fontWeight={600}
              textAlign={"center"}
              fontSize={24}
              mb={8}
            >
              Change Password
            </Text>
            <Text
              sx={{ marginTop: "10px", fontSize: "15px", marginLeft: "8px" }}
            >
              New Password
            </Text>
            <FormControl sx={{ m: 1, width: "400px" }} variant="outlined">
              <InputGroup size="lg">
                <Input
                  fontSize={16}
                  placeholder="Please enter password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleClickShowPassword()}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Text
              sx={{ marginTop: "24px", fontSize: "15px", marginLeft: "8px" }}
            >
              Confirm New Password
            </Text>
            <FormControl sx={{ m: 1, width: "400px" }} variant="outlined">
              <InputGroup size={"lg"}>
                <Input
                  fontSize={16}
                  placeholder="Please enter confirm password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => handleClickShowPassword()}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {!passwordData.passwordsMatch && (
              <div className="confirmPasswordWarning">
                Confirm password needs to be the same as password
              </div>
            )}
            <Flex justifyContent={"end"} mt={4}>
              <Button onClick={handleSubmit}>Submit</Button>
            </Flex>
          </div>
        </Flex>
      ) : (
        <ErrorPage />
      )}
    </>
  );
};

export default ResetPWPage;
