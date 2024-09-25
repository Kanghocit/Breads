import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../../store/PostSlice";
import { Constants } from "../../../../share/Constants";

const GifBox = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const gif = [
    "https://media.giphy.com/media/3o6ZsUaNnPPLf9Ek1K/giphy.gif",
    "https://media.giphy.com/media/jq7tzQFz2ZaQNnLXl4/giphy.gif?cid=790b7611x869xooikr2du1u77b52xx0pgob7kvlukmrwh9wx&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/l3vR85PnGsBwu1PFK/giphy.gif",
    "https://media.giphy.com/media/26Ff1YTzdkvKDHkqQ/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDg2OXhvb2lrcjJkdTF1NzdiNTJ4eDBwZ29iN2t2bHVrbXJ3aDl3eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11pEf1ZMBCxoe4/giphy.gif",
    "https://media.giphy.com/media/fnMUoQgpmlDtyyMSrj/giphy.gif?cid=790b7611xqjssv6n67borpperc6rxruh2ojdsgyb9cedr9jn&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/yy4FMvzk7hLFoFGz3W/giphy.gif?cid=ecf05e47fu1s0d9qwj7g8y83wf38b8dug2xqc9pyrbqsx48u&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzZtM2JyZWV3dzR6bmlydDFmNHd0em9mczZkazZkZHU5dnl1b3l2diZlcD12MV9naWZzX3RyZW5kaW5nJmN0PWc/TMYcPzTxK73qBmeakB/giphy.gif",
    "https://media.giphy.com/media/3CCXHZWV6F6O9VQ7FL/giphy.gif?cid=790b7611c6m3breeww4znirt1f4wtzofs6dk6ddu9vyuoyvv&ep=v1_gifs_trending&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/mLZ6kvGkH31z0BAKUX/giphy.gif?cid=790b7611c6m3breeww4znirt1f4wtzofs6dk6ddu9vyuoyvv&ep=v1_gifs_trending&rid=giphy.gif&ct=g",
  ];

  const handleAddGif = (url) => {
    dispatch(
      updatePostInfo({
        ...postInfo,
        media: [
          {
            url: url,
            type: Constants.MEDIA_TYPE.GIF,
          },
        ],
      })
    );
    onClose();
  };

  return (
    <>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          position={"relative"}
          boxSizing="border-box"
          width="620px"
          maxWidth={"620px"}
          bg={"white"}
          color={"gray"}
          pr={1}
          borderRadius={"16px"}
          id="modal"
        >
          <Box p={1}></Box>
          <Text
            position={"absolute"}
            top={"-36px"}
            left={"50%"}
            transform={"translateX(-50%)"}
            color={"white"}
            zIndex={4000}
            textTransform={"capitalize"}
            fontWeight={600}
            fontSize={"18px"}
          >
            Choose a gif
          </Text>
          <ModalCloseButton
            position={"absolute"}
            top={"-36px"}
            left={"0"}
            color={"white"}
          />

          <ModalBody
            p={0}
            overflowY={"auto"}
            maxHeight={"400px"}
            sx={{
              "&::-webkit-scrollbar": {
                width: "12px",
              },
              "&::-webkit-scrollbar-track": {
                background: "white",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray",
                borderRadius: "8px",
                border: "3px solid white",
              },
            }}
          >
            <Flex wrap="wrap" ml={"10px"}>
              {gif.map((link, index) => (
                <Image
                  key={link}
                  src={link}
                  alt={`GIF ${index + 1}`}
                  maxWidth="48%"
                  height="auto" // Maintain the original height of the GIF
                  borderRadius={"9px"}
                  m={1}
                  onClick={() => handleAddGif(link)}
                />
              ))}
            </Flex>
          </ModalBody>
          <Box p={2}></Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GifBox;
