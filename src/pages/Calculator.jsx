import React from "react";

function Calculator({ jobs, startDate, endDate }) {
  // Calculate the total job price
  const totalEarnings = jobs.reduce((acc, job) => acc + job.jobPriceRaw, 0);

  return (
    <div className="jobdone-calculator p-5">
      <h3 className="job-header">
        Designer {jobs[0].jobDesigner.data.display_name} completed {jobs.length}{" "}
        jobs
      </h3>
      <div className="job-list">
        {jobs.map((job, i) => (
          <span key={job.jobID} className="job-item">
            <span className="job-id">Job {job.jobID}</span>
            <span
              className="job-price"
              dangerouslySetInnerHTML={{ __html: job.jobPrice }}
            />
            {i !== jobs.length - 1 && ", "}
          </span>
        ))}
      </div>
      <p className="total-earnings">
        Total Earnings: €{totalEarnings.toFixed(2)}
      </p>
    </div>
  );
}

export default Calculator;
