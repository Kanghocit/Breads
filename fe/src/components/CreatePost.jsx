import React from 'react';
import { Button, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import CreatePostModal from '../components/base/CreatePostModal'; // Import modal component

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        
        onClick={onOpen}
      >
        Post
      </Button>

      {/* Add the CreatePostModal modal */}
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default CreatePost;
