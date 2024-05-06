/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

export default function SelectCar({ setItem }) {
  const chooseThis = (item) => {
    setItem(item);
  };

  const vehicles = [
    {
      id: 1,
      name: 'Мазда',
      plate: 'SK9819BM',
    },
    {
      id: 2,
      name: 'Tojota',
      plate: 'SK187VF',
    },
  ];
  return (
    <div className="lightSpeedIn">
      <div className="content">
        <div className="main-heading">
          Возило
        </div>
        <div className="check-field row ">
          {vehicles.map((vehicle) => (
            <div className="col-6 mb-4" key={vehicle.id}>
              <div className="check-field-single">
                <span className="item-name">{vehicle.name}</span>
                <span className="item-name">{vehicle.plate}</span>
                <input type="radio" value={vehicle.plate} onClick={() => chooseThis(vehicle)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
