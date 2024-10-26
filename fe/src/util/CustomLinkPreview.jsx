import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomLinkPreview = ({ url }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  console.log(data)
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        const response = await axios.get(
          `https://api.linkpreview.net?key=d8f12a27e6e5631b820f629ea7f570b8&q=${url}`
        );
        setData(response.data);
      } catch {
        setError(true);
      }
    };

    if (url) fetchLinkData();
  }, [url]);

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };


  if (error) {
    return (
      <div
        style={{
          border: "1px solid #e0e0e0",
          height: "80px",
          borderRadius: "8px",
          padding: "10px",
          marginTop: "8px",
          maxWidth: "100%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <div>
          <div>{extractDomain(url)}</div>
          <div style={{ color: "gray", fontSize: "10px", marginTop: "5px" }}>
            {extractDomain(url)}
          </div>
        </div>
        {/* <button
          style={{
            zIndex: 1,
            background: "transparent",
            border: "none",
            color: "gray",
            cursor: "pointer",
            fontSize: "18px",
            position: "absolute",
            top: 5,
            right: 5,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          &times;
        </button> */}
      </div>
    );
  }


  if (!data) return <div>Loading...</div>;


  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "10px",
        marginTop: "8px",
        maxWidth: "400px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      <button
        style={{
          zIndex: 1,
          background: "transparent",
          border: "none",
          color: "gray",
          cursor: "pointer",
          fontSize: "18px",
          position: "absolute",
          top: 5,
          right: 5,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setError(true); 
        }}
      >
        &times;
      </button>
      <h4 style={{ margin: "0 0 10px", fontSize: "18px", lineHeight: "1.2" }}>
        {data.title}
      </h4>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
  {data.image && (
    <>
      <img
        src={data.image}
        alt={data.title}
        style={{
          width: "100%",
          maxHeight: "200px",
          borderRadius: "4px",
          objectFit: "cover",
        }}
      />
      <p style={{ margin: '10px 0', fontSize: '14px', color: 'white' }}>
        {data.description.length > 30 ? `${data.description.slice(0, 100)}...` : data.description}
      </p>
    </>
  )}
</a>

    </div>
  );
};

export default CustomLinkPreview;
