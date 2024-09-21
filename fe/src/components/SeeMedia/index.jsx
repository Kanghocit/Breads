import {
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateSeeMedia } from "../../store/UtilSlice";
import { CloseIcon } from "@chakra-ui/icons";

const SeeMedia = () => {
  const dispatch = useDispatch();
  const seeMediaInfo = useSelector((state) => state.util.seeMediaInfo);

  const handleClose = () => {
    dispatch(
      updateSeeMedia({
        open: false,
        img: null,
      })
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
        <ModalContent margin="0" width={"100vw"} height={"100vh"}>
          <Flex justifyContent={"center"} height={"100vh"}>
            <Image
              src={seeMediaInfo.img}
              height={"100vh"}
              maxWidth={"80vw"}
              width={"fit-content"}
              objectFit={"cover"}
            />
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SeeMedia;
