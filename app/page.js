/*
To Do:
show error message if show kinetic chain is clicked but there is not a file returned yet.
create a show kinetic chain button for left side and right side.
if a new file is loaded, show video as loading until the original has been processed into a video with tracking.
Need to sync the times of the video!
original and processed video have different time? how?
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
  const originalVideoRef1 = useRef(null);
  const originalVideoRef2 = useRef(null);
  const trackedVideoRef1 = useRef(null);
  const trackedVideoRef2 = useRef(null);

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

    if (showKineticChain) {
      // Sync the current time of the original video to the tracked video
      if (originalVideoRef1.current && trackedVideoRef1.current) {
        console.log(
          "original video's previouse time:",
          originalVideoRef1.currentTime
        );
        trackedVideoRef1.current.pause(); // Pause the tracked video

        originalVideoRef1.currentTime = trackedVideoRef1.currentTime; // Sync time

        console.log(
          "original video's time after sync:",
          originalVideoRef1.currentTime
        );
        setShowKineticChain(false);
      }
    } else {
      // Sync the current time of the tracked video to the original video
      if (originalVideoRef1.current && trackedVideoRef1.current) {
        console.log(
          "Tracked video's previouse time:",
          originalVideoRef1.currentTime
        );
        originalVideoRef1.current.pause(); // Pause the original video

        trackedVideoRef1.currentTime = originalVideoRef1.currentTime; // Sync time

        console.log(
          "Tracked video's time after sync:",
          originalVideoRef1.currentTime
        );
        setShowKineticChain(true);
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
        <div className="holds-L-R flex flex-row my-5 justify-center">
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
              <div className="relative w-full max-w-lg h-auto">
                {file && (
                  <video
                    src={file}
                    ref={originalVideoRef1}
                    controls
                    className={`absolute top-0 left-0 w-full h-auto rounded-lg ${
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
                    className={`absolute top-0 left-0 w-full h-auto rounded-lg ${
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
              <div className="relative w-full max-w-lg h-auto">
                {file2 && (
                  <video
                    src={file2}
                    ref={originalVideoRef2}
                    controls
                    className={`absolute top-0 left-0 w-full h-auto rounded-lg ${
                      showKineticChain ? "z-0" : "z-10"
                    }`}
                    type="video/mp4"
                  />
                )}
                {fileWithJoint2 && (
                  <video
                    src={fileWithJoint2}
                    ref={trackedVideoRef2}
                    controls
                    className={`absolute top-0 left-0 w-full h-auto rounded-lg ${
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDrop;
