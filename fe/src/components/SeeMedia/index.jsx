import { ArrowBackIcon, ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Constants } from "../../../../share/Constants";
import { updateSeeMedia } from "../../store/UtilSlice";

const SeeMedia = () => {
  const dispatch = useDispatch();
  const seeMediaInfo = useSelector((state) => state.util.seeMediaInfo);
  const currentMedia = seeMediaInfo.media?.[seeMediaInfo.currentMediaIndex];

  useEffect(() => {
    if (seeMediaInfo?.media.length > 1) {
      const listenKeyDown = (e) => {
        e.preventDefault();
        if (e.keyCode === 39) {
          handleChangeCurrentMedia(1);
        } else if (e.keyCode === 37) {
          handleChangeCurrentMedia(-1);
        }
      };
      window.addEventListener("keydown", listenKeyDown);
      return () => {
        window.removeEventListener("keydown", listenKeyDown);
      };
    }
  }, [seeMediaInfo.currentMediaIndex]);

  const handleClose = () => {
    dispatch(
      updateSeeMedia({
        open: false,
        media: [],
        currentMediaIndex: -1,
      })
    );
  };

  const handleChangeCurrentMedia = (addStep) => {
    const addStepIndex = seeMediaInfo.currentMediaIndex + addStep;
    let nextIndex = -1;
    switch (addStepIndex) {
      case seeMediaInfo.media.length:
        nextIndex = 0;
        break;
      case -1:
        nextIndex = seeMediaInfo.media.length - 1;
        break;
      default:
        nextIndex = addStepIndex;
        break;
    }
    dispatch(
      updateSeeMedia({
        ...seeMediaInfo,
        currentMediaIndex: nextIndex,
      })
    );
  };

  const moveBtn = (addStep) => {
    return (
      <Button
        position={"fixed"}
        top={"50%"}
        width={"40px"}
        height={"40px"}
        left={addStep === -1 ? "12px" : ""}
        right={addStep === 1 ? "12px" : ""}
        borderRadius={"50%"}
        bg={"gray"}
        opacity={"0.3"}
        _hover={{
          opacity: "0.6",
        }}
        onClick={() => {
          handleChangeCurrentMedia(addStep);
        }}
      >
        {addStep === -1 ? (
          <ArrowBackIcon width={"32px"} height={"32px"} />
        ) : (
          <ArrowForwardIcon width={"32px"} height={"32px"} />
        )}
      </Button>
    );
  };

  return (
    <>
      <CloseIcon
        position={"fixed"}
        top={"24px"}
        left={"24px"}
        width={"40px"}
        height={"40px"}
        boxSizing="border-box"
        padding={"8px"}
        borderRadius={"50%"}
        cursor={"pointer"}
        zIndex={5000}
        _hover={{
          bg: "gray",
        }}
        onClick={handleClose}
      />
      <Modal isOpen={seeMediaInfo.open} onClose={handleClose}>
        <ModalOverlay bg={"black"} />
        <ModalContent
          margin="0"
          width={"100vw"}
          height={"100vh"}
          bg={"transparent"}
        >
          {seeMediaInfo?.media?.length > 1 && (
            <>
              {moveBtn(-1)}
              {moveBtn(1)}
            </>
          )}
          <Flex justifyContent={"center"} height={"100vh"} bg={"transparent"}>
            {currentMedia.type === Constants.MEDIA_TYPE.VIDEO ? (
              <video
                style={{
                  maxWidth: "80vw",
                  height: "100vh",
                  width: "fit-content",
                }}
                src={currentMedia?.url}
                controls
                autoPlay
              />
            ) : (
              <Image
                src={currentMedia?.url}
                height={"100vh"}
                maxWidth={"80vw"}
                width={"fit-content"}
                objectFit={"cover"}
              />
            )}
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SeeMedia;
