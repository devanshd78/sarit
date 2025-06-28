"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import type { Props as SelectProps, StylesConfig } from "react-select";

// Dynamically import ReactSelect with proper generic types to avoid hydration and TS mismatches
const ReactSelect = dynamic<SelectProps<Option, false>>(
  () => import("react-select").then((mod) => mod.default),
  { ssr: false }
);

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

interface FilterMenuProps {
  availability: "all" | "in-stock" | "out-of-stock";
  priceSort: "low-high" | "high-low" | "";
  onChange: (filters: { availability: FilterMenuProps["availability"]; priceSort: FilterMenuProps["priceSort"] }) => void;
}

export const FilterMenu: FC<FilterMenuProps> = ({ availability, priceSort, onChange }) => (
  <div className="flex items-center space-x-4 text-sm text-black">
    <span className="font-medium">Filter:</span>

    <div className="w-40">
      <ReactSelect
        value={availabilityOptions.find((o) => o.value === availability)}
        options={availabilityOptions}
        styles={selectStyles}
        onChange={(opt) => onChange({ availability: opt!.value as FilterMenuProps["availability"], priceSort })}
        isSearchable={false}
      />
    </div>

    <div className="w-32">
      <ReactSelect
        value={priceOptions.find((o) => o.value === priceSort)}
        options={priceOptions}
        styles={selectStyles}
        placeholder="Price"
        onChange={(opt) => onChange({ availability, priceSort: opt!.value as FilterMenuProps["priceSort"] })}
        isSearchable={false}
      />
    </div>
  </div>
);
