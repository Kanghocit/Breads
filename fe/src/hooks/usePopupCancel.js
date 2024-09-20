import { useEffect, useState } from "react";

const usePopupCancel = () => {
  const defaultPopupInfo = {
    open: false,
    title: "",
    content: "",
    leftBtnText: "",
    rightBtnText: "",
    leftBtnAction: () => {},
    rightBtnAction: () => {},
  };
  const [popupCancelInfo, setPopupCancelInfo] = useState(defaultPopupInfo);

  const closePopupCancel = () => {
    setPopupCancelInfo(defaultPopupInfo);
  };
  return {
    popupCancelInfo,
    setPopupCancelInfo,
    closePopupCancel,
  };
};

export default usePopupCancel;
