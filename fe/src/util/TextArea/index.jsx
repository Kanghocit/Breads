import { Container, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import UsersTagBox from "../../components/UsersTagBox";
import "./index.css";
import { useSelector } from "react-redux";

const getCaretCoordinates = (input) => {
  const { selectionStart } = input;
  const tempDiv = document.createElement("div");
  const inputStyle = window.getComputedStyle(input);

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

  tempDiv.textContent = input.value.slice(0, selectionStart);
  const markerSpan = document.createElement("span");
  markerSpan.textContent = "|";
  tempDiv.appendChild(markerSpan);

  document.body.appendChild(tempDiv);
  const { top, left } = markerSpan.getBoundingClientRect();
  document.body.removeChild(tempDiv);

  return { left, top };
};

const extractDomain = (url) => {
  const match = url.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
  return match ? match[1] : ""; // Return the full domain
};

const TextArea = ({ text, setText, tagUsers = false }) => {
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");
  const postInfo = useSelector((state) => state.post.postInfo);
  const usersTag = postInfo?.usersTag || [];
  const textAreaRef = useRef(null);
  const popupRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [openTagBox, setOpenTagBox] = useState(false);
  const [urls, setUrls] = useState([]);

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const handleChange = (e) => {
    const value = e.target.value;

    if (tagUsers) {
      if (!value[value.length - 1]?.trim() && searchValue?.trim()) {
        setSearchValue("");
      } else {
        const tagRegex = /@(\w+)/g;
        const tagNames = [...value.matchAll(tagRegex)].map((arr) => arr[1]);
        const latestTagValue = tagNames[tagNames.length - 1];
        if (searchValue !== latestTagValue) {
          setSearchValue(latestTagValue);
        }
      }
    }

    const extractedUrls = value.match(urlRegex) || [];
    setUrls(extractedUrls);

    setText(value);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [text]);

  useEffect(() => {
    if (usersTag.length && tagUsers) {
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
    if (searchValue?.trim()) {
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
        style={{ color: textColor }}
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        rows="1"
        placeholder="Type something..."
        className="auto-expand-textarea"
      />

      {urls.length > 0 && (
        <div
          style={{
            border: "1px solid #e0e0e0",
            height: "80px",
            borderRadius: "8px",
            backgroundColor: bgColor,
            padding: "10px",
            marginTop: "8px",
            maxWidth: "100%",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.2s ease-in-out",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div>{extractDomain(urls[0])}</div>
              <div
                style={{
                  color: "gray",
                  fontSize: "10px",
                  marginRight: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {extractDomain(urls[0])} {/* Show the full URL */}
              </div>
            </div>

            <button
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "24px",
                position: "absolute",
                top: -5,
                right: 5,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setUrls([]);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

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
