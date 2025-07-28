"use client";
import { FC } from "react";

interface Props {
  value: number;
  onInc: () => void;
  onDec: () => void;
}

const QuantityStepper: FC<Props> = ({ value, onInc, onDec }) => (
  <div className="flex items-center border rounded-md overflow-hidden">
    <button onClick={onDec} className="px-3 py-1 hover:bg-gray-100">–</button>
    <span className="px-4 select-none">{value}</span>
    <button onClick={onInc} className="px-3 py-1 hover:bg-gray-100">+</button>
  </div>
);

export default QuantityStepper;