import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../../store/PostSlice";
import "./index.css";

const CustomLinkPreview = ({
  url = "",
  link = null,
  bg = "",
  color = "",
  borderColor = "",
}) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const [data, setData] = useState(link);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (url) {
      fetchLinkData();
    }
  }, [url]);

  const fetchLinkData = async () => {
    try {
      const { data } = await axios.get(
        `https://api.linkpreview.net?key=d8f12a27e6e5631b820f629ea7f570b8&q=${url}`
      );
      setData(data);
      dispatch(
        updatePostInfo({
          ...postInfo,
          links: [...postInfo?.links, data],
        })
      );
    } catch {
      setError(true);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div
      className="preview-link-container"
      style={{
        backgroundColor: bg ? bg : "",
        color: color ? color : "",
        border: borderColor ? `1px solid ${borderColor}` : "",
      }}
    >
      <h4 className="link-title">{data.title}</h4>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {data.image && (
          <>
            <img src={data.image} className="link-img" />
            <p
              className="link-des"
              style={{
                backgroundColor: bg ? bg : "",
                color: color ? color : "",
              }}
            >
              {data.description.length > 100
                ? `${data.description.slice(0, 100)}...`
                : data.description}
            </p>
          </>
        )}
      </a>
    </div>
  );
};

export default CustomLinkPreview;
