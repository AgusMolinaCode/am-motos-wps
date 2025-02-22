import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsDemo() {
  const words = ["repuestos", "accesorios", "indumentaria"];

  return (
    <div className="h-[8rem] lg:h-[20rem] flex justify-center items-center px-2">
      <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center text-gray-200">
        Importamos
        <FlipWords words={words} /> <br />
        para tu moto/ATV 
      </div>
    </div>
  );
}
