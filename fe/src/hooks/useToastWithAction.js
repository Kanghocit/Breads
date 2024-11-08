import { useState } from "react";

const useToastWithAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onAction, setOnAction] = useState(null);

  const showToast = (msg, actionCallback) => {
    setMessage(msg);
    setOnAction(() => actionCallback);
    setIsVisible(true);

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    message,
    onAction,
    showToast,
    hideToast,
  };
};

export default useToastWithAction;
