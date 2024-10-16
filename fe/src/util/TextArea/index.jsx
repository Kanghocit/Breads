import { Container, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import UsersTagBox from "../../components/UsersTagBox";
import "./index.css";
import { useSelector } from "react-redux";

const getCaretCoordinates = (input) => {
  const { selectionStart } = input;

  // Create a temporary span to mirror the input's content up to the cursor
  const tempDiv = document.createElement("div");
  const inputStyle = window.getComputedStyle(input);

  // Copy relevant styles from input to temporary div
  Object.assign(tempDiv.style, {
    position: "absolute",
    whiteSpace: "pre-wrap",
    visibility: "hidden",
    top: 0,
    left: 0,
    font: inputStyle.font,
    padding: inputStyle.padding,
    border: inputStyle.border,
    width: `${input.offsetWidth}px`,
  });

  // Insert the text up to the caret's position
  tempDiv.textContent = input.value.slice(0, selectionStart);

  // Add a marker span to identify the exact caret position
  const markerSpan = document.createElement("span");
  markerSpan.textContent = "|"; // A temporary marker
  tempDiv.appendChild(markerSpan);

  document.body.appendChild(tempDiv);

  // Get the marker's position relative to the viewport
  const { top, left } = markerSpan.getBoundingClientRect();
  document.body.removeChild(tempDiv);

  return { left, top };
};

const TextArea = ({ text, setText, tagUsers = false }) => {
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");
  const postInfo = useSelector((state) => state.post.postInfo);
  const usersTag = postInfo?.usersTag;
  const textAreaRef = useRef(null);
  const popupRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [openTagBox, setOpenTagBox] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    if (tagUsers) {
      if (!value[value.length - 1]?.trim() && !!searchValue?.trim()) {
        setSearchValue("");
      } else {
        const tagRegex = /@(\w+)/g;
        const tagNames = [...value.matchAll(tagRegex)].map((arr) => arr[1]);
        const latestTagValue = tagNames[tagNames.length - 1];
        if (searchValue !== tagNames[tagNames.length - 1]) {
          setSearchValue(latestTagValue);
        }
      }
    }
    setText(value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust based on scrollHeight
    }
  }, [text]);

  useEffect(() => {
    if (usersTag?.length && tagUsers) {
      const splitText = text.split(" ");
      for (const textIndex in splitText) {
        const tagIndex = usersTag.findIndex(
          ({ searchValue }) => splitText[textIndex] === `@${searchValue}`
        );
        if (tagIndex !== -1) {
          splitText[textIndex] = "@" + usersTag[tagIndex].username + " ";
        }
      }
      const newText = splitText.join(" ");
      setText(newText);
      textAreaRef.current.focus();
    }
  }, [usersTag]);

  useEffect(() => {
    if (!!searchValue?.trim()) {
      const splitStr = text.split(" ");
      if (splitStr[splitStr.length - 1]?.includes("@")) {
        const { left, top } = getCaretCoordinates(textAreaRef.current);
        popupRef.current.style.left = `${left + 16}px`;
        popupRef.current.style.top = `${top}px`;
        setOpenTagBox(true);
      } else {
        setOpenTagBox(false);
      }
    } else {
      setOpenTagBox(false);
    }
  }, [searchValue]);

  return (
    <div className="text-area-container">
      <textarea
        color={textColor}
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        rows="1"
        placeholder="Type something..."
        className="auto-expand-textarea"
      />
      {tagUsers && (
        <Container
          ref={popupRef}
          className="tag-popup"
          bg={bgColor}
          style={{
            display: openTagBox ? "block" : "none",
          }}
        >
          <UsersTagBox
            searchValue={searchValue}
            setOpenTagBox={setOpenTagBox}
          />
        </Container>
      )}
    </div>
  );
};

export default TextArea;
