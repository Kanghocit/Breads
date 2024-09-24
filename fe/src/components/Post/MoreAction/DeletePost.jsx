import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useDeletePost = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const handleDeleteClick = async (postId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete post.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Post deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/${userInfo.username}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return { handleDeleteClick };
};

export default useDeletePost;
