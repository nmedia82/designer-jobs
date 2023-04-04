import React from "react";

function Calculator({ jobs, startDate, endDate }) {
  // Calculate the total job price
  const totalEarnings = jobs.reduce((acc, job) => acc + job.jobPriceRaw, 0);

  const format_price = (price) => {
    const priceStr = price.toFixed(2); // convert to string with 2 decimal places
    const priceParts = priceStr.split("."); // split into integer and decimal parts
    const integerPart = priceParts[0];
    const decimalPart = priceParts[1];
    const formattedPrice = `${integerPart},${decimalPart} €`;
    return formattedPrice;
  };
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
        Total Earnings: {format_price(totalEarnings)}
      </p>
    </div>
  );
}

export default Calculator;
