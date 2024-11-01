import { Flex, Image, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const ItemUploadDisplay = ({ item, imgSrc, onClick, isPost = false }) => {
  return !isPost ? (
    <Flex
      key={item?.name}
      height={"100%"}
      width={"fit-content"}
      padding={"6px"}
      border={"1px solid gray"}
      margin={0}
      flexDirection={"column"}
      justifyContent={"space-between"}
      position={"relative"}
    >
      <CloseIcon
        position={"absolute"}
        top={"-7px"}
        right={"-7px"}
        width={"14px"}
        height={"14px"}
        borderRadius={"50%"}
        bg={"gray"}
        p={"2px"}
        cursor={"pointer"}
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => {
          onClick();
        }}
      />
      <Image
        src={imgSrc}
        width={"100%"}
        maxHeight={"calc(100% - 16px)"}
        objectFit={"contain"}
      />
      <Text
        maxWidth={"50px"}
        fontSize={"11px"}
        textOverflow={"ellipsis"}
        overflow={"hidden"}
        whiteSpace={"nowrap"}
      >
        {item?.name}
      </Text>
    </Flex>
  ) : (
    <Flex
      key={item?.name}
      height={"100%"}
      maxWidth={"450px"}
      minWidth={"300px"}
      padding={"6px"}
      border={"1px solid gray"}
      margin={0}
      flexDirection={"row"}
      position={"relative"}
      alignItems={"center"}  

    >
      <CloseIcon
        position={"absolute"}
        top={"-7px"}
        right={"-7px"}
        width={"14px"}
        height={"14px"}
        borderRadius={"50%"}
        bg={"gray"}
        p={"2px"}
        cursor={"pointer"}
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => {
          onClick();
        }}
      />
      <Image
        src={imgSrc}
        width={"20%"}
        maxHeight={"calc(100% - 16px)"}
        objectFit={"contain"}
      />
      <Text
      marginLeft={"10px"}
        maxWidth={"300px"}
        fontSize={"16px"}
        textOverflow={"ellipsis"}
        overflow={"hidden"}
        whiteSpace={"wrap"}
        flex={1}  
      >
        {item?.name}
      </Text>
    </Flex>
  );
};

export default ItemUploadDisplay;
