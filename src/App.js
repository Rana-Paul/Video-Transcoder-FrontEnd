import React, { useCallback, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import { BiCloudUpload } from "react-icons/bi";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const convert = async() => {
    if(!file) {
      setError({type: "Empty", msg: "Please Select a Video File"})
    }
    else {
      
      const formData = new FormData();
      formData.append("file", file);
      
      axios.post("https://api.video-transcoder.online/convert", formData, {responseType: 'blob'}).then((res) => {
        setLoading(false);
        fileDownload(res.data, 'Output.zip')
      }).catch((err) => {
        console.log(err.message);
        setError({type: 'Network', msg: 'Server is Down Now, Please Try after Some Time'})
      })
    }
  };
  // setTimeout(() => {
  //       setLoading(true);
        
  //     }, 5000);

  return (
    <>
      <div className="App" >

        {/* if err then show it here using err.msg*/}

        <div className="container">
          <div className="box"
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <div className="dragactive">
              <p>Drop the files here ...</p>
            </div>
            ) : (
              <div className="dragactivenone">
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <BiCloudUpload color="white" size={40}/>
                  </div>
                  {file ? (
                    <p>{file.name}</p>
                  ) : (
                    <p>
                      Drag & drop some files here, or click to select files
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {loading? (
            <div className="loading">
            <div className="loader"></div>
            <div className="text">
            <div>Converting . . .</div>
            </div>
            </div>
            
          ):(
            <button
            //  onClick={convert}
             >
            Convert
          </button>
          )}
            
            
        </div>

        {/* Convert Button  */}
      </div>
    </>
  );
}

export default App;
