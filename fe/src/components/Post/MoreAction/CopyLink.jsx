import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const useCopyLink = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const toast = useToast();
  const copyURL = (postInfo) => {
    const postURL = `${window.location.origin}/${userInfo?.username}/post/${postInfo?._id}`;
    navigator.clipboard.writeText(postURL).then(() => {
      toast({
        title: "Link copied.",
        description: "The link has been copied to your clipboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return { copyURL };
};

export default useCopyLink;
