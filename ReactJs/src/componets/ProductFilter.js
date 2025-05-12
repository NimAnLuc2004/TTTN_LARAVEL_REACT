import React, { useState, useEffect } from "react";

const ProductFilter = ({ brands, onApplyFilter }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (brandId) => {
    if (selectedBrands.includes(brandId)) {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId));
    } else {
      setSelectedBrands([...selectedBrands, brandId]);
    }
  };

  const handleApply = () => {
    onApplyFilter(selectedBrands);
    setIsDropdownOpen(false);
  };

  const handleReset = () => {
    setSelectedBrands([]);
  };

  return (
    <div className="relative inline-block ">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-gray-200 px-4 py-2 rounded-md"
      >
        Thị trường: {selectedBrands.length > 0 ? `${selectedBrands.length} đã chọn` : "Tất cả"}
      </button>

      {isDropdownOpen && (
        <div className="absolute bg-white border rounded-md shadow-lg w-64 p-4 z-10">
          <div className="max-h-60 overflow-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleCheckboxChange(brand.id)}
                />                <span>{brand.name}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
              onClick={handleReset}
            >
              Đặt lại
            </button>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
              onClick={handleApply}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
