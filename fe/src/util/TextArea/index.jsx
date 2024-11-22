// TextArea.jsx
import { Container, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import UsersTagBox from "../../components/UsersTagBox";
import CustomLinkPreview from "../CustomLinkPreview";
import "./index.css";

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
  return match ? match[1] : "";
};

const TextArea = ({ text, setText, tagUsers = false }) => {
  const { t } = useTranslation();
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
  console.log("khangurlss",urls)

  return (
    <div className="text-area-container">
      <textarea
        style={{ color: textColor }}
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        rows="1"
        placeholder={t("whatnew")}
        className="auto-expand-textarea"
      />

      {urls.length > 0 && <CustomLinkPreview url={urls} bgColor={bgColor} />}

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
