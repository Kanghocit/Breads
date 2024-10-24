import { Flex } from "@chakra-ui/react";
import FileMsg from "./File";

const FilesMsg = ({ files }) => {
  return (
    <Flex flexDir={"column"} gap={2}>
      {files?.map((file) => (
        <FileMsg key={file._id} file={file} />
      ))}
    </Flex>
  );
};

export default FilesMsg;
