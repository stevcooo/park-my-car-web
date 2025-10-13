/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import vehicleService from '../services/vehicleService';

export default function AddVehicle({ onVehicleAdded, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    plate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVehicle = () => {
    if (formData.name.trim() && formData.plate.trim()) {
      const newVehicle = vehicleService.addVehicle(formData);

      // Reset form
      setFormData({ name: '', plate: '' });

      // Notify parent component if callback provided
      if (onVehicleAdded) {
        onVehicleAdded(newVehicle);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', plate: '' });
    if (onCancel) {
      onCancel();
    }
  };
  return (
    <section className="steps">
      <div className="lightSpeedIn">
        <div className="main-heading">Додади возило</div>
        <div className="input-field row">
          <div className="col-md-3 text-end">
            <label>Возило</label>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Внесете име на возилото"
            />
          </div>
        </div>
        <div className="input-field row">
          <div className="col-md-3 text-end">
            <label>Регистрација</label>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              name="plate"
              value={formData.plate}
              onChange={handleInputChange}
              placeholder="Внесете регистрација"
            />
          </div>
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev" onClick={handleCancel}>
          Откажи
        </button>
        <button type="button" className="next" onClick={handleAddVehicle}>
          Додади
        </button>
      </div>
    </section>
  );
}
