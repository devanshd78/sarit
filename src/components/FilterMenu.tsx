// src/components/FilterMenu.tsx
"use client";

import { FC } from "react";
import ReactSelect, { StylesConfig } from "react-select";

type Option = { value: string; label: string };

const availabilityOptions: Option[] = [
  { value: "all", label: "All" },
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];

const priceOptions: Option[] = [
  { value: "low-high", label: "Low to High" },
  { value: "high-low", label: "High to Low" },
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
  singleValue: (provided) => ({
    ...provided,
    color: "#000",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: 6,
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
    color: "#000",
    cursor: "pointer",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6b7280",
    padding: 4,
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export const FilterMenu: FC = () => (
  <div className="flex items-center space-x-4 text-sm text-black">
    <span className="font-medium">Filter:</span>

    <div className="w-40">
      <ReactSelect
        options={availabilityOptions}
        styles={selectStyles}
        placeholder="Availability"
        isSearchable={false}
      />
    </div>

    <div className="w-32">
      <ReactSelect
        options={priceOptions}
        styles={selectStyles}
        placeholder="Price"
        isSearchable={false}
      />
    </div>
  </div>
);
