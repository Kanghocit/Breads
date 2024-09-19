import { useEffect, useRef } from "react";

const ClickOutsideComponent = ({ children, onClose }) => {
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClose && onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default ClickOutsideComponent;
