import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const useUpdatePost = (onClose) => {
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateClick = async (post, inputs, imgUrl) => {
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/posts/update/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ ...inputs, img: imgUrl }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post updated successfully!", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
      if (onClose) onClose(); 
    }
  };

  return { handleUpdateClick, updating };
};

export default useUpdatePost;
