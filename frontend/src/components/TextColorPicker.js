import React from 'react';

function TextColorPicker({ value, onChange }) {
  return (
    <div className="flex items-center">
      <label className="mr-2 font-semibold">Color de texto:</label>
      <input type="color" value={value} onChange={onChange} />
      <span className="ml-2" style={{ color: value }}>{value}</span>
    </div>
  );
}

export default TextColorPicker;