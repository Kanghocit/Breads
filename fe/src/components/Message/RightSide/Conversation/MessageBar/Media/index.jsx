import { Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { TbLibraryPhoto } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { iconStyle } from "..";
import { Constants } from "../../../../../../Breads-Shared/Constants";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";
import { convertToBase64 } from "../../../../../../util";

const MediaUpload = () => {
  const dispatch = useDispatch();
  const msgInfo = useSelector((state) => state.message.msgInfo);
  const [mediaData, setMediaData] = useState([]);
  const mediaRef = useRef();

  useEffect(() => {
    if (mediaData?.length) {
      handleUpdateMsgMedia();
    }
  }, [mediaData]);

  const handleUpdateMsgMedia = async () => {
    try {
      const { IMAGE, VIDEO } = Constants.MEDIA_TYPE;
      const mediaInfo = [];
      for (let i = 0; i < mediaData.length; i++) {
        const base64 = await convertToBase64(mediaData[i]);
        mediaInfo[i] = {
          url: base64,
          type: mediaData[i]?.type.includes("image") ? IMAGE : VIDEO,
        };
      }
      dispatch(
        updateMsgInfo({
          ...msgInfo,
          media: mediaInfo,
        })
      );
    } catch (err) {
      console.error("handleUpdateMsgMedia: ", err);
    }
  };

  return (
    <>
      <Input
        type="file"
        accept="image/*"
        multiple
        style={iconStyle}
        hidden
        ref={mediaRef}
        onChange={(e) => {
          setMediaData(e.target.files);
        }}
      />
      <TbLibraryPhoto
        style={iconStyle}
        onClick={() => mediaRef.current.click()}
      />
    </>
  );
};

export default MediaUpload;
