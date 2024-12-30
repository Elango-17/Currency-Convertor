import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(1); // Raw input value
  const [debouncedAmount, setDebouncedAmount] = useState(1); // Debounced value
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 500);

    return () => clearTimeout(handler);
  }, [amount]);

  useEffect(() => {
    async function convert() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${debouncedAmount}&from=${fromCur}&to=${toCur}`
        );
        if (!res.ok) throw new Error("Failed to fetch conversion data.");
        const data = await res.json();
        setConverted(data.rates[toCur]);
      } catch (err) {
        setError(err.message);
        setConverted(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (fromCur === toCur) {
      setConverted(debouncedAmount);
      return;
    }

    if (debouncedAmount > 0) convert();
  }, [debouncedAmount, fromCur, toCur]);

  return (
    <div className="container">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value) || 0)}
        disabled={isLoading}
        min="0"
      />
      <select
        value={fromCur}
        onChange={(e) => setFromCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCur}
        onChange={(e) => setToCur(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {isLoading
          ? "Loading..."
          : error
          ? `Error: ${error}`
          : `${converted} ${toCur}`}
      </p>
    </div>
  );
}
