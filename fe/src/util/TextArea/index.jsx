import React, { useEffect, useRef } from "react";
import "./index.css";

const TextArea = ({ text, setText }) => {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust based on scrollHeight
    }
  }, [text]);

  return (
    <div>
      <textarea
        style={{
          color: "black",
        }}
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        rows="1"
        placeholder="Type something..."
        className="auto-expand-textarea"
      />
    </div>
  );
};

export default TextArea;
