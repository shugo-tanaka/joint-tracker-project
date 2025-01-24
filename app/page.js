/*
To Do:
maybe make it an option to overlay the joints.
*/

"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const DragDrop = () => {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  const [fileWithJoint, setFileWithJoint] = useState(null);
  const [file2WithJoint, setFile2WithJoint] = useState(null);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(URL.createObjectURL(uploadedFile));
    setFileToSend(uploadedFile);
  };

  useEffect(() => {
    const getJoints1 = async () => {
      // console.log("file has changed:", file);
      const formData = new FormData();
      formData.append("file", fileToSend); // Ensure file is added correctly
      // console.log([...formData]);

      try {
        const response = await fetch("http://127.0.0.1:8000/joint_tracker/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.blob();
          const mp4Data = new Blob([data], { type: "video/mp4" });
          // console.log("Video data size:", data.size);
          const url = URL.createObjectURL(mp4Data);
          console.log("this is the url:", url);
          setFileWithJoint(url);
          // const link = document.createElement("a");
          // link.href = url;
          // link.download = "output.mp4";
          // link.click();
        } else {
          console.error("Error processing the video", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (file) {
      getJoints1();
      console.log("getJoints 1 has finished running");
      // console.log("this is fileWithJoint:", fileWithJoint);
    }
  }, [file]);

  useEffect(() => {
    return () => {
      if (fileWithJoint) {
        URL.revokeObjectURL(fileWithJoint); // Cleanup the URL when the component unmounts or URL changes
      }
    };
  }, [fileWithJoint]);

  const onDrop2 = (acceptedFiles2) => {
    const uploadedFile2 = acceptedFiles2[0];
    setFile2(URL.createObjectURL(uploadedFile2));
    // console.log("onDrop2 completed");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/avi",
      "video/mov",
    ],
    onDrop,
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: ["video/mp4", "image/jpeg", "image/png", "image/gif"],
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
                <video
                  src={file}
                  controls
                  className="max-w-full h-fit rounded-lg"
                  type="video/mp4"
                />
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
              {fileWithJoint && (
                <div style={{ marginTop: "20px" }}>
                  {fileWithJoint.endsWith(".mp4") ? (
                    <video
                      src={fileWithJoint}
                      alt="Uploaded Preview"
                      className="max-w-full h-fit"
                      controls
                    />
                  ) : (
                    <video
                      src={fileWithJoint}
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
