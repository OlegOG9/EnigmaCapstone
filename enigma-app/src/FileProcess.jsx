import React from "react";
import { useState } from "react";
import Tesseract from "tesseract.js";

const FileProcess = () => {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const processImage = () => {
    setResult("");
    setProgress(0);
    console.log(file);
    Tesseract.recognize(file, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(m.progress);
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };
  return (
    <div>
      <h1>ProcesFiles</h1>
      <input type="file" onChange={onFileChange} />
      <div style={{ marginTop: 25 }}>
        <input type="button" value="Process Image" onClick={processImage} />
      </div>
      <div>
        <progress value={progress} max="1" />
      </div>
      {result !== "" && (
        <div>
          <h2>Result: </h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default FileProcess;
