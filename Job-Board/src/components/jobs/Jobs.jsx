import { useState, useEffect } from "react";

const Jobs = () => {
  const [data, setData] = useState([]);
  const url = "http://localhost:3000/data";

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const newJob = JSON.parse(event.data);
      setData((prevData) => [...prevData, newJob]);
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);
    }
  }, [data]);

  return (
    <div>
      <h2>Jobs</h2>
      <ul>
        {data.map((job, index) => (
          <li key={index}>{job.company}</li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
