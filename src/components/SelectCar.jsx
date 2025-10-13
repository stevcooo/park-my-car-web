/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';

export default function SelectCar({ setItem, refreshTrigger }) {
  const [vehicles, setVehicles] = useState([]);

  // Load vehicles from localStorage on component mount and when refreshTrigger changes
  useEffect(() => {
    const loadedVehicles = vehicleService.initializeDefaultVehicles();
    setVehicles(loadedVehicles);
  }, [refreshTrigger]);

  const chooseThis = (item) => {
    setItem(item);
  };

  const removeVehicle = (vehicleId, event) => {
    event.stopPropagation();
    const updatedVehicles = vehicleService.removeVehicle(vehicleId);
    setVehicles(updatedVehicles);
  };
  return (
    <div className="lightSpeedIn">
      <div className="content">
        <div className="main-heading">Возило</div>
        <div className="check-field row ">
          {vehicles.map((vehicle) => (
            <div className="col-6 mb-4" key={vehicle.id}>
              <div className="check-field-single" onClick={() => chooseThis(vehicle)}>
                <button
                  type="button"
                  className="btn btn-sm btn-danger badge-icon m-1"
                  onClick={(event) => removeVehicle(vehicle.id, event)}
                  title="Отстрани возило">
                  ×
                </button>
                <span className="item-name">{vehicle.name}</span>
                <span className="item-name">{vehicle.plate}</span>
                <div className="d-flex align-items-center gap-2">
                  <input type="radio" value={vehicle.plate} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
