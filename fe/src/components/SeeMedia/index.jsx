import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateSeeMedia } from "../../store/UtilSlice";

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
  );
};

export default SeeMedia;
