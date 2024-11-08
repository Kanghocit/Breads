import {
  Avatar,
  Button,
  Card,
  Flex,
  Input,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostAction } from "../store/PostSlice";
import PostConstants from "../util/PostConstants";
import { changePage } from "../store/UtilSlice/asyncThunk";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreatePostBar = () => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue("cuse.light", "cuse.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleOpenPostPopup = () => {
    dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
  };

  return (
    <Card padding={"16px 20px"} borderRadius={"12px"} mb={"12px"} bg={bgColor}>
      <Flex gap={"12px"} alignItems={"center"}>
        <a
          href={`/users/${userInfo._id}`}
          onClick={(e) => {
            e.preventDefault();
            dispatch(changePage({ nextPage: PageConstant.USER }));
            navigate(`/users/${userInfo._id}`);
          }}
        >
          <Avatar src={userInfo?.avatar} alt="user-avatar" />
        </a>
        <Input
          placeholder={t("whatnew")}
          padding={"12px"}
          border={"none"}
          defaultValue={""}
          onChange={(e) => {}}
          onClick={() => handleOpenPostPopup()}
        />
        <Button onClick={() => handleOpenPostPopup()}>{t("post")}</Button>
      </Flex>
    </Card>
  );
};

export default CreatePostBar;
