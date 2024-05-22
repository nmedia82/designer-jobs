import React from "react";
import { Image } from "react-bootstrap";

function FileDownloads({ jobData }) {
  // Assuming jobData.fileDownloads is an object with keys as identifiers and values as URLs
  return (
    <>
      {Object.values(jobData.fileDownloads).map((url, index) => (
        <a
          key={index}
          href={url}
          className="m-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={process.env.PUBLIC_URL + "/download-icon.png"}
            width="40"
            alt={`Download file ${index + 1}`}
          />
        </a>
      ))}
    </>
  );
}

export default FileDownloads;
