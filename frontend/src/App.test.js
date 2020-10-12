import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import App from './App';

test('loads ui', () => {
  const { getByText } = render(<App />);
  const currencyConvert = getByText('Currency Converter');
  const inputCurrency = getByText('Euro');
  const outputCurrency = getByText('Dollar');
  expect(currencyConvert).toBeInTheDocument();
  expect(inputCurrency).toBeInTheDocument();
  expect(outputCurrency).toBeInTheDocument();
});

test('invalid input is set to 0', () => {
  const { getByLabelText } = render(<App />);
  const input = getByLabelText('user-input');
  fireEvent.change(input, { target: { value: 'abd' } });
  expect(input.value).toBe('0')
})

test('changing input changes output', async () => {
  const { getByLabelText } = render(<App />);
  const input = getByLabelText('user-input');
  const output = getByLabelText('user-output');
  expect(output.value).toBe('0.00');
  fireEvent.change(input, { target: { value: '10' } });
  expect(input.value).toBe('10')
  await wait(() => expect(output.value).not.toBe('0.00'));
})
