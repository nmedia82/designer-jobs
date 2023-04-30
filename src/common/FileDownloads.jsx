import { useState } from "react";
import { Container, Image } from "react-bootstrap";

function FileDownloads({ jobData }) {
  return (
    <>
      {Object.values(jobData.fileDownlloads).map((url, index) => (
        <a key={index} href={url} className="m-1" target="_blank">
          <img
            src={process.env.PUBLIC_URL + "/download-icon.png"}
            width="40"
            alt={jobData.orderID}
          />
        </a>
      ))}
    </>
  );
}

export default FileDownloads;
