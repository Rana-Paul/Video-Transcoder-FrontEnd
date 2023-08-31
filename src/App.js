import React, { useCallback, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import { BiCloudUpload } from "react-icons/bi";
import { Button } from "@material-ui/core";
import axios from "axios";
import fileDownload from "js-file-download";
function App() {
  const onDrop = useCallback(async (acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".MP4", "WMV", "AVI", "wmv", "avi"],
    },
  });

  const [file, setFile] = useState();
  const [error, setError] = useState();

  const convert = async() => {

    if(!file) {
      setError("Please Upload a Video")
    }
    else {

      const formData = new FormData();
      formData.append("file", file);
      axios.post("http://localhost:8000/convert", formData, {responseType: 'blob'}).then((res) => {
        fileDownload(res.data, 'Output.zip')
      })
    }
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        {/* if err? then error msg show here */}

        <div style={{ width: "40%", height: "40%" }}>
          <div
            style={{ width: "100%", height: "100%", border: "2px solid red" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <BiCloudUpload color="black" size={40} />
                  </div>
                  {file ? (
                    <p>{file.name}</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={convert} variant="contained" fullWidth>
              Convert
            </Button>
          </div>
        </div>

        {/* Convert Button  */}
      </div>
    </>
  );
}

export default App;
