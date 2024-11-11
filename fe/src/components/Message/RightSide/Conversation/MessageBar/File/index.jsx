import { SmallAddIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { useRef } from "react";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { iconStyle } from "..";
import { fileTypes } from "../../../../../../Breads-Shared/Constants";
import useShowToast from "../../../../../../hooks/useShowToast";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";
import { updatePostInfo } from "../../../../../../store/PostSlice";

const FileUpload = ({ setFilesData, isPost = false }) => {
  const dispatch = useDispatch();
  const msgInfo = useSelector((state) => state.message.msgInfo);
  const postInfo = useSelector((state) => state.post.postInfo);
  const showToast = useShowToast();
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Object.values(e.target.files);

    if (selectedFiles?.length > 5) {
      showToast("", "You can only upload a maximum of 5 files", "info");
      return;
    }
    if (
      selectedFiles &&
      selectedFiles.every((file) => {
        let isValid = false;
        const typeValues = Object.values(fileTypes);
        typeValues.forEach((typeValue) => {
          typeValue.forEach((type) => {
            if (type == file.type) {
              isValid = true;
            }
          });
        });
        return isValid;
      })
    ) {
      const fileMetaData = selectedFiles.map((file) => {
        return {
          name: file.name,
          contentType: file.type,
        };
      });
      setFilesData(selectedFiles);
      if (!isPost) {
        dispatch(
          updateMsgInfo({
            ...msgInfo,
            files: fileMetaData,
          })
        );
      } else {
        dispatch(
          updatePostInfo({
            ...postInfo,
            files: fileMetaData,
          })
        );
      }
    } else {
      showToast("", "Invalid file's type", "error");
    }
  };
  console.log("chạy vào file ");

  return (
    <>
      <Input
        type="file"
        multiple
        style={iconStyle}
        hidden
        ref={fileRef}
        onChange={handleFileChange}
      />
      {isPost ? (
        <AiOutlineFileAdd onClick={() => fileRef.current.click()} />
      ) : (
        <SmallAddIcon
          style={iconStyle}
          onClick={() => fileRef.current.click()}
        />
      )}
      {/* {files && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected File:</strong> {file.name} (
          {(files.size / 1024).toFixed(2)} KB)
        </div>
      )} */}
    </>
  );
};

export default FileUpload;
