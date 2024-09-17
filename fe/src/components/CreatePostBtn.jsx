import { AddIcon } from "@chakra-ui/icons";
import { Button, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { updatePostAction } from "../store/PostSlice";
import PostConstants from "../util/PostConstants";

const CreatePostBtn = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={() => {
          dispatch(updatePostAction(PostConstants.ACTIONS.CREATE));
        }}
      >
        Post
      </Button>
    </>
  );
};

export default CreatePostBtn;
