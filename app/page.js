/*
To Do:
show error message if show kinetic chain is clicked but there is not a file returned yet.
create a show kinetic chain button for left side and right side.

Completed:
if a new file is loaded, show video as loading until the original has been processed into a video with tracking.
*/

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

const DragDrop = () => {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  const [fileToSend2, setFileToSend2] = useState(null);
  const [fileWithJoint, setFileWithJoint] = useState(null);
  const [fileWithJoint2, setFileWithJoint2] = useState(null);
  const [showKineticChain, setShowKineticChain] = useState(false);
  const [showKineticChain2, setShowKineticChain2] = useState(false);
  const originalVideoRef1 = useRef(null);
  const originalVideoRef2 = useRef(null);
  const trackedVideoRef1 = useRef(null);
  const trackedVideoRef2 = useRef(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(URL.createObjectURL(uploadedFile));
    setFileToSend(uploadedFile);
  };

  useEffect(() => {
    const getJoints1 = async () => {
      // console.log("file has changed:", file);
      setLoading1(true);
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
          // const data = new Blob([response], { type: "video/mp4" });

          console.log(
            "Response content type:",
            response.headers.get("Content-Type")
          );

          // const mp4Data = new Blob([data], { type: "video/mp4" });
          // console.log("Video data size:", data.size);
          const url = URL.createObjectURL(data);
          console.log("Video data size:", data.size);

          console.log("this is the url:", url);

          console.log("Video MIME type:", data.type);
          // const link = document.createElement("a");
          // link.href = url;
          // link.download = "output.mp4";
          // link.click();
          // window.open(url);
          setFileWithJoint(url);
          setLoading1(false);
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
    setFileToSend2(uploadedFile2);
    // console.log("onDrop2 completed");
  };

  useEffect(() => {
    const getJoints2 = async () => {
      setLoading2(true);
      // console.log("file has changed:", file);
      const formData = new FormData();
      formData.append("file", fileToSend2); // Ensure file is added correctly
      // console.log([...formData]);

      try {
        const response = await fetch("http://127.0.0.1:8000/joint_tracker/", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.blob();
          // const data = new Blob([response], { type: "video/mp4" });

          console.log(
            "Response content type:",
            response.headers.get("Content-Type")
          );

          // const mp4Data = new Blob([data], { type: "video/mp4" });
          // console.log("Video data size:", data.size);
          const url = URL.createObjectURL(data);
          console.log("Video data size:", data.size);

          console.log("this is the url:", url);

          console.log("Video MIME type:", data.type);
          // const link = document.createElement("a");
          // link.href = url;
          // link.download = "output.mp4";
          // link.click();
          // window.open(url);
          setFileWithJoint2(url);
          setLoading2(false);
        } else {
          console.error("Error processing the video", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (file2) {
      getJoints2();
      console.log("getJoints 2 has finished running");
      // console.log("this is fileWithJoint:", fileWithJoint);
    }
  }, [file2]);

  useEffect(() => {
    return () => {
      if (fileWithJoint2) {
        URL.revokeObjectURL(fileWithJoint2); // Cleanup the URL when the component unmounts or URL changes
      }
    };
  }, [fileWithJoint2]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ["video/mp4", "image/jpeg", "image/png", "image/gif"],
    onDrop: onDrop,
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: ["video/mp4", "image/jpeg", "image/png", "image/gif"],
      onDrop: onDrop2,
    });

  const handleKineticChain = (e) => {
    e.preventDefault();
    const original1 = originalVideoRef1.current;
    const tracked1 = trackedVideoRef1.current;
    // const original2 = originalVideoRef2.current;
    // const tracked2 = trackedVideoRef2.current;

    if (showKineticChain) {
      // Sync the current time of the original video to the tracked video
      if (originalVideoRef1.current && trackedVideoRef1.current) {
        original1.currentTime = tracked1.currentTime;
        tracked1.pause();
        setShowKineticChain(false);
      }

      // if (originalVideoRef2.current && trackedVideoRef2.current) {
      //   original2.currentTime = tracked2.currentTime;
      //   setShowKineticChain(false);
      // }
    } else {
      // Sync the current time of the tracked video to the original video
      if (originalVideoRef1.current && trackedVideoRef1.current) {
        tracked1.currentTime = original1.currentTime;
        original1.pause();
        setShowKineticChain(true);
      }
      // if (originalVideoRef2.current && trackedVideoRef2.current) {
      //   tracked2.currentTime = original2.currentTime;
      //   setShowKineticChain(true);
      // }
    }
  };

  const handleKineticChain2 = (e) => {
    e.preventDefault();
    const original2 = originalVideoRef2.current;
    const tracked2 = trackedVideoRef2.current;

    if (showKineticChain2) {
      // Sync the current time of the original video to the tracked video

      if (originalVideoRef2.current && trackedVideoRef2.current) {
        original2.currentTime = tracked2.currentTime;
        tracked2.pause();
        setShowKineticChain2(false);
      }
    } else {
      // Sync the current time of the tracked video to the original video

      if (originalVideoRef2.current && trackedVideoRef2.current) {
        tracked2.currentTime = original2.currentTime;
        original2.pause();
        setShowKineticChain2(true);
      }
    }
  };

  return (
    <div className="flex justify-center align-center py-10">
      <div className="flex flex-col justify-center align-center w-full m-10">
        {" "}
        {/*holds the header and area for drop files*/}
        <div className="text-black text-xl text-center">
          Kinetic Chain Comparison
        </div>
        <div className="holds-L-R flex flex-row my-5 justify-center">
          {" "}
          {/*holds the two drop zones*/}
          <div className="left flex flex-col justify-center w-full">
            {" "}
            {/*holds video 1 divs*/}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 p-2.5 w-full text-center cursor-pointer flex flex-col items-center"
            >
              <input {...getInputProps()} />
              <p className="text-black">
                Video 1: Drag & drop a file here, or click to select
              </p>
              {loading1 ? (
                <div className="flex flex-col items-center justify-center mt-5 mb-10">
                  {/* Loading spinner */}
                  <div>Processing Video</div>
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div className="relative w-full max-w-lg h-auto min-h-[300px]">
                  {file && (
                    <video
                      src={file}
                      ref={originalVideoRef1}
                      controls
                      className={`absolute max-h-[300px] top-0 left-0 w-full h-auto rounded-lg ${
                        showKineticChain ? "z-0" : "z-10"
                      }`}
                      type="video/mp4"
                    />
                  )}
                  {fileWithJoint && (
                    <video
                      src={fileWithJoint}
                      ref={trackedVideoRef1}
                      controls
                      className={`absolute max-h-[300px] top-0 left-0 w-full h-auto rounded-lg ${
                        showKineticChain ? "z-10" : "z-0"
                      }`}
                      type="video/mp4"
                      onError={() => console.error("Error loading video")}
                      onLoadedData={() =>
                        console.log("Successfully loaded video")
                      }
                    />
                  )}
                </div>
              )}
            </div>
            {showKineticChain ? (
              <button
                className="my-5 mx-auto bg-white hover:bg-gray-100 text-gray-800 px-4 border border-gray-400 rounded shadow"
                onClick={(e) => {
                  handleKineticChain(e);
                  console.log("button clicked");
                }}
              >
                Hide Kinetic Chain
              </button>
            ) : (
              <button
                className="my-5 mx-auto bg-white hover:bg-gray-100 text-gray-800 px-4 border border-gray-400 rounded shadow"
                onClick={(e) => {
                  handleKineticChain(e);
                  console.log("button clicked");
                }}
              >
                Show Kinetic Chain
              </button>
            )}
          </div>
          <div className="C w-5"></div>{" "}
          {/*just to add space between the videos*/}
          <div className="Right flex flex-col justify-center w-full">
            <div
              {...getRootProps2()}
              className="border-2 border-dashed border-gray-300 p-2.5 w-full text-center cursor-pointer flex flex-col items-center"
            >
              <input {...getInputProps2()} />
              <p className="text-black">
                Video 2: Drag & drop a file here, or click to select
              </p>
              {loading2 ? (
                <div className="flex flex-col items-center justify-center mt-5 mb-10">
                  {/* Loading spinner */}
                  <div>Processing Video</div>
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <div className="relative w-full max-w-lg h-auto min-h-[300px]">
                  {file2 && (
                    <video
                      src={file2}
                      ref={originalVideoRef2}
                      controls
                      className={`absolute max-h-[300px] top-0 left-0 w-full h-auto rounded-lg ${
                        showKineticChain2 ? "z-0" : "z-10"
                      }`}
                      type="video/mp4"
                    />
                  )}
                  {fileWithJoint2 && (
                    <video
                      src={fileWithJoint2}
                      ref={trackedVideoRef2}
                      controls
                      className={`absolute max-h-[300px] top-0 left-0 w-full h-auto rounded-lg ${
                        showKineticChain2 ? "z-10" : "z-0"
                      }`}
                      type="video/mp4"
                      onError={() => console.error("Error loading video")}
                      onLoadedData={() =>
                        console.log("Successfully loaded video")
                      }
                    />
                  )}
                </div>
              )}

              {/* {fileWithJoint && (
                <div style={{ marginTop: "20px" }}>
                  {fileWithJoint.endsWith("mp4") ? (
                    <video
                      src={fileWithJoint}
                      alt="Uploaded Preview"
                      className="max-w-full h-fit"
                      controls
                      onError={() =>
                        console.error(
                          "Error loading video option 1",
                          fileWithJoint
                        )
                      }
                      onLoadedData={() =>
                        console.log("Video loaded successfully")
                      }
                    />
                  ) : (
                    // <video controls className="max-w-full h-fit rounded-lg">
                    //   <source
                    //     src={fileWithJoint}
                    //     type="video/mp4"
                    //     onError={() => console.log("Error loading video")}
                    //     onLoadedData={() =>
                    //       console.log("video loaded successfully")
                    //     }
                    //   ></source>
                    // </video>
                    <video
                      src={fileWithJoint}
                      controls
                      className="max-w-full h-fit rounded-lg"
                      onError={() =>
                        console.error(
                          "Error loading video option 2",
                          fileWithJoint
                        )
                      }
                      onLoadedData={() =>
                        console.log("Video loaded successfully")
                      }
                    />
                  )}
                </div>
              )} */}
            </div>

            {showKineticChain2 ? (
              <button
                className="my-5 mx-auto bg-white hover:bg-gray-100 text-gray-800 px-4 border border-gray-400 rounded shadow"
                onClick={(e) => {
                  handleKineticChain2(e);
                  console.log("button clicked");
                }}
              >
                Hide Kinetic Chain
              </button>
            ) : (
              <button
                className="my-5 mx-auto bg-white hover:bg-gray-100 text-gray-800 px-4 border border-gray-400 rounded shadow"
                onClick={(e) => {
                  handleKineticChain2(e);
                  console.log("button clicked");
                }}
              >
                Show Kinetic Chain
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
