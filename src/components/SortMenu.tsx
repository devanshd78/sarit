"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import type { Props as SelectProps, StylesConfig } from "react-select";

// Dynamically import ReactSelect with proper generic types to avoid SSR mismatches
const ReactSelect = dynamic<SelectProps<Option, false>>(
  () => import("react-select").then((mod) => mod.default),
  { ssr: false }
);

type Option = { value: string; label: string };

const sortOptions: Option[] = [
  { value: "az", label: "Alphabetically, A–Z" },
  { value: "za", label: "Alphabetically, Z–A" },
  { value: "low-high", label: "Price, Low to High" },
  { value: "high-low", label: "Price, High to Low" },
];

const selectStyles: StylesConfig<Option, false> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#9ca3af" },
    borderRadius: 6,
    minHeight: 38,
    padding: "2px 4px",
  }),
  singleValue: (provided) => ({ ...provided, color: "#000" }),
  placeholder: (provided) => ({ ...provided, color: "#6b7280" }),
  menu: (provided) => ({ ...provided, borderRadius: 6, overflow: "hidden" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
    color: "#000",
    cursor: "pointer",
  }),
  dropdownIndicator: (provided) => ({ ...provided, color: "#6b7280", padding: 4 }),
  indicatorSeparator: () => ({ display: "none" }),
};

interface SortMenuProps {
  total: number;
}

export const SortMenu: FC<SortMenuProps> = ({ total }) => (
  <div className="flex items-center space-x-3 text-sm text-black">
    <span className="font-medium">Sort by:</span>

    <div className="w-48">
      <ReactSelect
        options={sortOptions}
        styles={selectStyles}
        placeholder="Alphabetically, A–Z"
        isSearchable={false}
      />
    </div>

    <span className="text-gray-500">{total} products</span>
  </div>
);
