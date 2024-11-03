import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updatePostInfo } from "../../store/PostSlice";
import "./index.css";

const CustomLinkPreview = ({ url }) => {
  const dispatch = useDispatch();
  const postInfo = useSelector((state) => state.post.postInfo);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
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

    if (url) fetchLinkData();
  }, [url]);

  if (!data) return <div></div>;

  return (
    <div className="preview-link-container">
      <h4 className="link-title">{data.title}</h4>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {data.image && (
          <>
            <img src={data.image} className="link-img" />
            <p className="link-des">
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
