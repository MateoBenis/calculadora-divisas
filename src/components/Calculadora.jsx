import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Calculadora({ data }) {
  const [montoIzq, setMontoIzq] = useState("");
  const [montoDer, setMontoDer] = useState("");
  const [currencyIzq, setCurrencyIzq] = useState("ARS");
  const [currencyDer, setCurrencyDer] = useState("BRL");
  const [lastUpdated, setLastUpdated] = useState("izq");

  function calcular(monto, usdpriceIzq, usdpriceDer, direction) {
    if (direction === "izq") {
      let montoUSD = monto / usdpriceIzq;
      let montoConvertido = montoUSD * usdpriceDer;
      return montoConvertido * 0.8;
    } else {
      let Y = monto / usdpriceDer;
      let montoConvertido = Y * usdpriceIzq;
      return montoConvertido * 1.25;
    }
  }

  useEffect(() => {
    const obtenerPrecioPorCurrency = (currency) => {
      const country = data.find((country) => country.currency === currency);
      return country ? Number(country.usd_price) : 0;
    };

    const usdpriceIzq = obtenerPrecioPorCurrency(currencyIzq);
    const usdpriceDer = obtenerPrecioPorCurrency(currencyDer);

    if (lastUpdated === "izq" && montoIzq !== "") {
      const montoConvertido = calcular(
        montoIzq,
        usdpriceIzq,
        usdpriceDer,
        "izq"
      );
      setMontoDer(montoConvertido.toFixed(2));
    } else if (lastUpdated === "der" && montoDer !== "") {
      const montoConvertido = calcular(
        montoDer,
        usdpriceIzq,
        usdpriceDer,
        "der"
      );
      setMontoIzq(montoConvertido.toFixed(2));
    }
  }, [montoIzq, montoDer, currencyIzq, currencyDer, data, lastUpdated]);

  function handleMontoIzq(e) {
    setMontoIzq(e.target.value);
    setLastUpdated("izq");
  }

  function handleMontoDer(e) {
    setMontoDer(e.target.value);
    setLastUpdated("der");
  }

  return (
    <div className="">
      <form className="max-w-full mx-auto flex flex-col md:flex-row gap-3">
        <div className="flex justify-center items-center w-full md:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {" "}
              {/* Changed 'start-0' to 'left-0' and 'ps-3.5' to 'pl-3' */}
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                />
              </svg>
            </div>
            <input
              type="number"
              id="currency-input-izq"
              className="block p-2 md:p-2.5 w-full z-20 pl-10 md:pl-10 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" // Changed 'ps-10' to 'pl-10'
              value={montoIzq}
              onChange={(e) => handleMontoIzq(e)}
              placeholder={`Monto en ${
                data.find((country) => country.currency === currencyIzq)
                  ?.currency || "moneda seleccionada"
              }`}
            />
          </div>
          <select
            onChange={(e) => {
              setCurrencyIzq(e.target.value);
            }}
            value={currencyIzq}
            className="flex-shrink-0 z-10 inline-flex items-center py-2 md:py-2.5 px-1 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
          >
            {data.map((country) => (
              <option key={country._id} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center items-center my-2 md:my-0">
          <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="swapHorizontalIconTitle"
            stroke="#000000"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
            color="#000000"
            width={20}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <title id="swapHorizontalIconTitle">
                Swap items (horizontally)
              </title>{" "}
              <path d="M16 4L19 7L16 10"></path> <path d="M4 7L18 7"></path>{" "}
              <path d="M7 20L4 17L7 14"></path> <path d="M19 17L5 17"></path>{" "}
            </g>
          </svg>
        </div>

        <div className="flex justify-center items-center w-full md:w-auto">
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1M2 5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                />
              </svg>
            </div>
            <input
              type="number"
              id="currency-input-der"
              className="block p-2 md:p-2.5 w-full z-20 ps-10 md:pl-10 text-sm text-gray-900 bg-gray-50 rounded-s-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={montoDer}
              onChange={(e) => handleMontoDer(e)}
              placeholder={`Monto en ${
                data.find((country) => country.currency === currencyDer)
                  ?.currency || "moneda seleccionada"
              }`}
            />
          </div>
          <select
            onChange={(e) => {
              setCurrencyDer(e.target.value);
            }}
            value={currencyDer}
            className="flex-shrink-0 z-10 inline-flex items-center py-2 md:py-2.5 px-1 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
          >
            {data.map((country) => (
              <option key={country._id} value={country.currency}>
                {country.currency}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
}

Calculadora.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      usd_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
};

export default Calculadora;
