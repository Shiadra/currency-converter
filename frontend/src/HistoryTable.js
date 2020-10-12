import React from 'react';
import './HistoryTable.css';

const HistoryTable = ({ history }) => {
  return (
      <table>
        <thead>
        <tr>
          <th>
            Conversion Date
          </th>
          <th>
            Input Amount
          </th>
          <th>
            Input Currency
          </th>
          <th>
            Output Amount
          </th>
          <th>
            Output Currency
          </th>
        </tr>
        </thead>
        <tbody>
        {history.slice(0,10).map(({ date, inputAmount, inputCurrency, outputAmount, outputCurrency }) => (
          <tr key={date}>
            <td>
              {new Date(date).toLocaleTimeString()}
            </td>
            <td>
              {inputAmount.toFixed(2)}
            </td>
            <td>
              {inputCurrency}
            </td>
            <td>
              {outputAmount.toFixed(2)}
            </td>
            <td>
              {outputCurrency}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
  );
}

export default HistoryTable;
