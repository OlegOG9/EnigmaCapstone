import React from "react";
import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";

const FileProcess = (userId) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/transactions/${userId.userId}`)
      .then((response) => {
        console.log("response.data.rows: ", response.data.rows);
        setTransactions(response.data.rows);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [values, setValues] = useState({
    userid: userId.userId,
    amount: 0,
    description: "",
    type: "",
  });
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
      setValues({
        ...values,
        description: text.substring(9, text.length - 2),
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("values: ", values);
    console.log("values.type: ", values.type);
    console.log("values.userid.userId: ", values.userid.userId);
    const numericAmount = parseFloat(values.amount);

    // Check if the conversion was successful
    if (isNaN(numericAmount)) {
      console.error("Amount is not a valid number:", values.amount);
      return;
    }

    // Update the values object with the numeric amount
    const updatedValues = { ...values, amount: numericAmount };

    console.log(updatedValues);
    //call the API
    axios
      .post("http://localhost:8081/addtrx", values)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log(res);
          console.log("res.data ", res.data);
        } else {
          console.log(res.data.Status);
          console.log("res: ", res);
          console.log("res.data ", res.data);
          console.log("res.data.description", res.data.description);
          alert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <div style={{ marginTop: 25 }}>
        <input
          type="button"
          value="Process Image text"
          onClick={processImage}
        />
      </div>
      <div>
        <progress value={progress} max="1" />
      </div>
      {result !== "" && (
        <div>
          <h2>Result: </h2>
          <p>{result}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="amount">
                <strong>Enter the amount of this transaction</strong>
              </label>
              <input
                type="number"
                placeholder="Enter the amount of this transaction"
                className="form-control rounded-0"
                id="amount"
                onChange={(e) =>
                  setValues({ ...values, amount: e.target.value })
                }
              />
              <label htmlFor="transactiontype">
                Choose a transaction type (credit/debit) :{" "}
              </label>

              <select
                name="transactiontype"
                id="transactiontype"
                defaultValue={"debit"}
                onChange={(e) => setValues({ ...values, type: e.target.value })}
              >
                <option value="debit">debit</option>
                <option value="credit">credit</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-0">
              Process Transaction
            </button>
          </form>
        </div>
      )}
      <div>
        <table>
          <tbody>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
            {transactions.map((item) => (
              <tr key={item.transaction_id}>
                <td>{item.description}</td>
                <td>${item.amount}</td>
                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileProcess;
