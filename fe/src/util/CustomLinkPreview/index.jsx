import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../../store/PostSlice";
import "./index.css";
import { TiDeleteOutline } from "react-icons/ti";
import PostConstants from "../PostConstants";

const CustomLinkPreview = ({
  url = "",
  bg = "",
  color = "",
  borderColor = "",
}) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const postAction = useSelector((state) => state.post.postAction);

  useEffect(() => {
    if (url) {
      fetchLinkData(url);
    } else if (postInfo?.links.length > 0) {
      setData(postInfo.links[0]);
    }
  }, [url, postInfo.links]);

  const fetchLinkData = async (fetchUrl) => {
    try {
      const { data } = await axios.get(
        `https://api.linkpreview.net?key=d8f12a27e6e5631b820f629ea7f570b8&q=${fetchUrl}`
      );
      setData(data);
      dispatch(
        updatePostInfo({
          ...postInfo,
          links: [...postInfo.links, data],
        })
      );
    } catch {
      setError(true);
    }
  };

  const handleDeleteLink = () => {
    const remainingLinks = postInfo.links.filter((link) => link !== data);
    setData(remainingLinks[0] || null);
    dispatch(
      updatePostInfo({
        ...postInfo,
        links: remainingLinks,
      })
    );
  };
  if (!data) return <div>Loading...</div>;

  return (
    <div
      className="preview-link-container"
      style={{
        backgroundColor: bg || "",
        color: color || "",
        border: borderColor ? `1px solid ${borderColor}` : "",
        position: "relative",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      {postAction === PostConstants.ACTIONS.CREATE && (
        <TiDeleteOutline
          onClick={handleDeleteLink}
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            color: "white",
            border: "none",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        />
      )}

      <h4 className="link-title">{data.title}</h4>

      <a href={data.url} target="_blank" rel="noopener noreferrer">
        {data.image && (
          <>
            <img
              src={data.image}
              className="link-img"
              alt={data.title}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
            <p
              className="link-des"
              style={{
                backgroundColor: bg || "",
                color: color || "",
                marginTop: "8px",
              }}
            >
              {data.description?.length > 100
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
