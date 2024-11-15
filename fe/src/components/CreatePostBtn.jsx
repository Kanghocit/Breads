import { AddIcon } from "@chakra-ui/icons";
import { Button, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { updatePostAction } from "../store/PostSlice";
import PostConstants from "../util/PostConstants";
import { useTranslation } from "react-i18next";

const CreatePostBtn = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <>
      <Button
        display={["none", "none", "flex"]}
        padding={"25px"}
        opacity={0.8}
        position={"fixed"}
        bottom={10}
        right={10}
        bg={"#444444"}
        zIndex={1000}
        onClick={() => {
          dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
        }}
      >
        <AddIcon />
      </Button>
    </>
  );
};

export default CreatePostBtn;
