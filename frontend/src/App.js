import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hybrid ATS Frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
