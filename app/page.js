/*
To Do:
Connect to git hub
right now, left and right can only handle the same file.

maybe make it an option to overlay the joints.
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
    <div className="flex justify-center align-center py-10">
      <div className="flex flex-col justify-center align-center w-full m-10">
        {" "}
        {/*holds the header and area for drop files*/}
        <div className="text-black text-xl text-center">Joint Tracker</div>
        <div className="holds-L-R flex flex-row my-10 justify-center">
          {" "}
          {/*holds the two drop zones*/}
          <div className="left flex flex-col justify-center w-full">
            {" "}
            {/*holds video 1 divs*/}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 p-2.5 w-full text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-black">
                Video 1: Drag & drop a file here, or click to select
              </p>
              {file && (
                <div style={{ marginTop: "20px" }}>
                  {file.endsWith(".mp4") ? (
                    <video
                      src={file}
                      alt="Uploaded Preview"
                      className="max-w-full h-fit"
                      controls
                    />
                  ) : (
                    <video
                      src={file}
                      controls
                      className="max-w-full h-fit rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="C w-5"></div>{" "}
          {/*just to add space between the videos*/}
          <div className="Right flex flex-col justify-center w-full">
            <div
              {...getRootProps2()}
              className="border-2 border-dashed border-gray-300 p-2.5 w-full text-center cursor-pointer"
            >
              <input {...getInputProps2()} />
              <p className="text-black">
                Video 2: Drag & drop a file here, or click to select
              </p>
              {file2 && (
                <div style={{ marginTop: "20px" }}>
                  {file2.endsWith(".mp4") ? (
                    <video
                      src={file2}
                      alt="Uploaded Preview"
                      className="max-w-full h-fit"
                      controls
                    />
                  ) : (
                    <video
                      src={file2}
                      controls
                      className="max-w-full h-fit rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
