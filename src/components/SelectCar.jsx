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
      name: 'Toyota Corolla',
      plate: 'SK 1234 AB',
    },
    {
      id: 2,
      name: 'Ford Focus',
      plate: 'SK 5678 CD',
    },
    {
      id: 3,
      name: 'VW Golf',
      plate: 'SK 9012 EF',
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
                <input defaultChecked type="radio" name="insurance" value={vehicle.plate} onClick={() => chooseThis(vehicle)} />
              </div>
              <span className="insurance-type">{vehicle.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev">Previous Step</button>
        <button type="button" id="step2btn" className="next">Next Step</button>
      </div>
    </section>
  );
}
