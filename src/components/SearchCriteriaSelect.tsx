import React from "react";
import { Select } from "antd";
import { SearchCriteria } from "../types";

const { Option } = Select;

interface SearchCriteriaSelectProps {
  defaultValue: SearchCriteria;
  onChange: (value: SearchCriteria) => void;
}

const SearchCriteriaSelect: React.FC<SearchCriteriaSelectProps> = ({
  defaultValue,
  onChange,
}) => {
  const handleSearchCriteriaChange = (value: SearchCriteria) => {
    onChange(value);
  };

  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: 120 }}
      onChange={handleSearchCriteriaChange}
    >
      <Option value={SearchCriteria.Username}>Name</Option>
      <Option value={SearchCriteria.Age}>Age</Option>
      <Option value={SearchCriteria.Hometown}>Hometown</Option>
    </Select>
  );
};

export default SearchCriteriaSelect;
