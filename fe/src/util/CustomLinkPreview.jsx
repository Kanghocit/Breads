import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../store/PostSlice";

const CustomLinkPreview = ({ url = "", link = null }) => {
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
      style={{
        zIndex: "10000",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "10px",
        marginTop: "8px",
        maxWidth: "400px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <h4
        style={{
          margin: "0 0 10px",
          fontWeight: "bold",
          fontSize: "16px",
          lineHeight: "1.2",
        }}
      >
        {data.title}
      </h4>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {data.image && (
          <>
            <img
              src={data.image}
              style={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
            <p style={{ margin: "10px 0", fontSize: "14px", color: "white" }}>
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
