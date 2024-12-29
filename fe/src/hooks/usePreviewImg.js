import { useState } from "react";
import { useTranslation } from "react-i18next";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
  const { t } = useTranslation();
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast(t("fileerror"), t("plchoose"), "error");
      setImgUrl(null);
    }
  };
  return { handleImageChange, imgUrl, setImgUrl };
};
export default usePreviewImg;
