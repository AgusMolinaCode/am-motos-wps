import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo() {
  const words = ["repuestos", "accesorios", "indumentaria"];

  return (
    <div className="h-[20rem] w-[50rem] flex justify-center items-center px-4">
      <div className="text-6xl font-semibold text-center text-gray-200">
        Importamos
        <FlipWords words={words} /> <br />
        para tu moto/ATV 
      </div>
    </div>
  );
}
