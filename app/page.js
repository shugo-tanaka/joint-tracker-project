/*
To Do:
Connect to git hub
right now, left and right can only handle the same file.
*/

"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDrop = () => {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(URL.createObjectURL(uploadedFile));
  };

  const onDrop2 = (acceptedFiles2) => {
    const uploadedFile2 = acceptedFiles2[0];
    setFile2(URL.createObjectURL(uploadedFile2));
    // console.log("onDrop2 completed");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
    onDrop,
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
      onDrop: onDrop2,
    });

  return (
    <div className="flex justify-center align-center p-10">
      <div className="flex flex-col justify-center align-center">
        <div className="text-black text-lg text-center">File Dropper</div>
        <div className="holds-L-R flex flex-row m-10">
          <div className="left flex flex-col justify-center">
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #ccc",
                padding: "5px",
                width: "400px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps()} />
              <p className="text-black">
                Drag & drop a file here, or click to select
              </p>
            </div>

            {file && (
              <div style={{ marginTop: "20px" }}>
                <h4>Video 1:</h4>
                {file.endsWith(".mp4") ? (
                  <video
                    src={file}
                    alt="Uploaded Preview"
                    style={{ maxWidth: "100%", height: "auto" }}
                    controls
                  />
                ) : (
                  <video
                    src={file}
                    controls
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            )}
          </div>
          <div className="C p-5"></div>{" "}
          {/*just to add space between the videos*/}
          <div className="Right flex flex-col justify-center">
            <div
              {...getRootProps2()}
              style={{
                border: "2px dashed #ccc",
                padding: "5px",
                width: "400px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <input {...getInputProps2()} />
              <p className="text-black">
                Drag & drop a file here, or click to select
              </p>
            </div>

            {file2 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Video 2:</h4>
                {file2.endsWith(".mp4") ? (
                  <video
                    src={file2}
                    alt="Uploaded Preview"
                    style={{ maxWidth: "100%", height: "auto" }}
                    controls
                  />
                ) : (
                  <video
                    src={file2}
                    controls
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
