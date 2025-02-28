import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { decodeString } from "../Breads-Shared/util";
import { handleUpdatePW } from "../components/UpdateUser/changePWModal";
import useShowToast from "../hooks/useShowToast";
import { changePage } from "../store/UtilSlice/asyncThunk";
import ErrorPage from "./ErrorPage";
import { addEvent } from "../util";

const ResetPWPage = () => {
  const { t } = useTranslation();
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(changePage({ nextPage: PageConstant.RESET_PW }));
    addEvent({
      event: "see_page",
      payload: {
        page: "reset_password",
      },
    });
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

  const validateInputs = () => {
    const validationErrors = {};
    if (!passwordData.password) {
      validationErrors.password = t("passwordRequired2");
    } else if (passwordData.password.length <= 6) {
      validationErrors.password = t("minPassWarning");
    }
    if (
      passwordData.confirmPassword !== passwordData.password &&
      !!passwordData.password.trim()
    ) {
      validationErrors.confirmPW = t("confirmWarning");
    }
    return validationErrors;
  };

  const handleBlur = (field) => {
    const validate = validateInputs();
    let newErrors = { ...errors };
    if (field === "password") {
      newErrors.password = validate.password || "";
    }
    if (field == "confirmPassword") {
      newErrors.confirmPW = validate.confirmPW || "";
    }
    setErrors(newErrors);
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
              {t("changePW")}
            </Text>
            <Text
              sx={{ marginTop: "10px", fontSize: "15px", marginLeft: "8px" }}
            >
              {t("newPW")}
            </Text>
            <FormControl
              sx={{ m: 1, width: "400px" }}
              variant="outlined"
              isInvalid={!!errors.password}
            >
              <InputGroup size="lg">
                <Input
                  fontSize={16}
                  placeholder={t("passwordRequired2")}
                  type={showPassword ? "text" : "password"}
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                  onBlur={() => handleBlur("password")}
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
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Text
              sx={{ marginTop: "24px", fontSize: "15px", marginLeft: "8px" }}
            >
              {t("confirmPW")}
            </Text>
            <FormControl
              sx={{ m: 1, width: "400px" }}
              variant="outlined"
              isInvalid={!!errors.confirmPW}
            >
              <InputGroup size={"lg"}>
                <Input
                  fontSize={16}
                  placeholder={t("confirmPWRequired")}
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  onBlur={() => handleBlur("confirmPassword")}
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
              <FormErrorMessage>{errors.confirmPW}</FormErrorMessage>
            </FormControl>
            <Flex justifyContent={"end"} mt={4}>
              <Button onClick={handleSubmit}>{t("submit")}</Button>
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
