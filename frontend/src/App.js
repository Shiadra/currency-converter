import React, { useEffect, useState } from 'react';
import {
  Col, Row,
} from 'react-bootstrap';
import './App.css';
import Select from 'react-select';
import HistoryTable from './HistoryTable';

const currencyOptions = [
  { value: 'EUR', label: 'Euro' },
  { value: 'USD', label: 'Dollar' },
  { value: 'JPY', label: 'Yen' },
  { value: 'GBP', label: 'Pound' },
]

const App = () => {
  const [inputAmount, setInputAmount] = useState(0);
  const [inputCurrency, setInputCurrency] = useState(currencyOptions[0]);
  const [outputAmount, setOutputAmount] = useState(0);
  const [outputCurrency, setOutputCurrency] = useState(currencyOptions[1]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/conversion?offset=0&limit=10`)
      .then(result => result.json())
      .then(result => {
        setHistory(result);
      })
  }, [])

  useEffect(() => {
    if(inputAmount === 0) {
      setOutputAmount(0);
      return;
    }
    fetch(`http://localhost:3001/conversion/convert?inputCurrency=${inputCurrency.value}&outputCurrency=${outputCurrency.value}&inputAmount=${inputAmount}`)
      .then(result => result.json())
      .then(result => {
        setOutputAmount(result.outputAmount);
        setHistory([result, ...history]);
      })
  }, [inputCurrency, inputAmount, outputCurrency]);

  const validateNumber = (value) => {
    const float = parseFloat(value);
    return Number.isNaN(float) ? 0 : float;
  }

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <Row style={{margin: 20}}>
        <Col xs={2}>
          <Select options={currencyOptions} value={inputCurrency} onChange={(option) => {setInputCurrency(option)}} />
        </Col>
        <input name="amount" aria-label="user-input" type="number" value={inputAmount} onChange={(event) => {setInputAmount(validateNumber(event.target.value))}} />
      </Row>
      <Row style={{margin: 20}}>
        <Col xs={2}>
          <Select options={currencyOptions} value={outputCurrency} onChange={(option) => {setOutputCurrency(option)}} />
        </Col>
        <input name="result" aria-label="user-output"  value={outputAmount.toFixed(2)} disabled />
      </Row>
      <Row style={{margin: 20}}>
        <HistoryTable history={history} />
      </Row>
    </div>
  );
}

export default App;
