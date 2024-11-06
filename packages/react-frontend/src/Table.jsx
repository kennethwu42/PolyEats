import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Complex</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.complexData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.name}</td>
      </tr>
    );
   }
  );
  return (
      <tbody>
        {rows}
       </tbody>
   );
}

function Table(props) {
    return (
      <table>
        <TableHeader />
        <TableBody 
          complexData={props.complexData}
        />
      </table>
    );
}

export default Table;