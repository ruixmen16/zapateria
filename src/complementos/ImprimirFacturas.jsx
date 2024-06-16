import React from "react";
import ReactToPrint, { useReactToPrint } from "react-to-print";

const ImprimirFacturas = () => {
  const { handlePrint } = useReactToPrint({
    trigger: () => <button onClick={() => handlePrint()}>Imprimir</button>,
    content: () => (
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>30</td>
          </tr>
        </tbody>
      </table>
    ),
  });

  return (
    <div>
      <button onClick={() => handlePrint()}>Imprimsir</button>
    </div>
  );
};

export default ImprimirFacturas;