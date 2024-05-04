/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectCar({ setItem }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const chooseThis = (item) => {
    setSelectedItem(item);
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
    <section className="steps">
      <div className="lightSpeedIn form" id="step2">
        <div className="main-heading">
          Изберете возило
          {' '}
          { selectedItem?.name}
        </div>
        <div className="check-field row">
          {vehicles.map((vehicle) => (
            <div className="tab-33 col-md-3" key={vehicle.id}>
              <div className="check-field-single">
                <img src="assets/images/insurance_types/hand.png" alt="" />
                <input type="radio" name="insurance" value={vehicle.plate} onClick={() => chooseThis(vehicle)} />
              </div>
              <span className="insurance-type">{vehicle.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
