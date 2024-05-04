/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectParking({ setItem }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const chooseThis = (item) => {
    setSelectedItem(item);
    setItem(item);
  };

  const parkings = [
    {
      id: 1,
      name: 'ПОЦ',
    },
    {
      id: 2,
      name: 'Градски Паркинг',
    },
  ];
  return (
    <section className="steps">
      <div className="lightSpeedIn form" id="step2">
        <div className="main-heading">
          Изберете паркинг
          {' '}
          { selectedItem?.name}
        </div>
        <div className="check-field row">
          {parkings.map((parking) => (
            <div className="tab-33 col-md-3" key={parking.id}>
              <div className="check-field-single">
                <img src="assets/images/insurance_types/hand.png" alt="" />
                <input defaultChecked type="radio" name="insurance" value={parking.name} onClick={() => chooseThis(parking)} />
              </div>
              <span className="insurance-type">{parking.name}</span>
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
