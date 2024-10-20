import { SmallAddIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iconStyle } from "..";
import useShowToast from "../../../../../../hooks/useShowToast";
import { updateMsgInfo } from "../../../../../../store/MessageSlice";

export const fileTypes = {
  word: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  excel: [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  powerpoint: [
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  text: ["text/plain"],
  pdf: ["application/pdf"],
};

const FileUpload = ({ setFilesData }) => {
  const dispatch = useDispatch();
  const msgInfo = useSelector((state) => state.message.msgInfo);
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
          type: file.type,
        };
      });
      setFilesData(selectedFiles);
      dispatch(
        updateMsgInfo({
          ...msgInfo,
          files: fileMetaData,
        })
      );
    } else {
      showToast("", "Invalid file's type", "error");
    }
  };

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
      <SmallAddIcon style={iconStyle} onClick={() => fileRef.current.click()} />

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
