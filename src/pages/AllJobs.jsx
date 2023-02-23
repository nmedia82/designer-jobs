import React from "react";

function AllJob() {
  const orders = [
    {
      id: 1,
      date: "2023-02-20",
      items: [
        {
          item_id: 1,
          item_name: "Item A",
          comment: "Comment 1",
          file_url: "https://example.com/file1.pdf",
        },
        {
          item_id: 2,
          item_name: "Item B",
          comment: "Comment 2",
          file_url: "https://example.com/file2.pdf",
        },
      ],
    },
    {
      id: 2,
      date: "2023-02-21",
      items: [
        {
          item_id: 3,
          item_name: "Item C",
          comment: "Comment 3",
          file_url: "https://example.com/file3.pdf",
        },
        {
          item_id: 4,
          item_name: "Item D",
          comment: "Comment 4",
          file_url: "https://example.com/file4.pdf",
        },
        {
          item_id: 5,
          item_name: "Item E",
          comment: "Comment 5",
          file_url: "https://example.com/file5.pdf",
        },
      ],
    },
  ];

  return (
    <div>
      <h2>All Jobs</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Order Items</th>
            <th>Download Files</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.item_id}>{item.item_name}</li>
                  ))}
                </ul>
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item.item_id}>
                    <a href={item.file_url}>File {item.item_id}</a>
                  </div>
                ))}
              </td>
              <td>
                {order.items.map((item) => (
                  <div key={item.item_id}>{item.comment}</div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary">Request a Pick</button>
    </div>
  );
}

export default AllJob;
