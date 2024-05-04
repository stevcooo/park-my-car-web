/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectParking({ items, setItem, goBack }) {
  const [, setSelectedItem] = useState(null);

  const chooseThis = (item) => {
    setSelectedItem(item);
    setItem(item);
  };

  return (
    <section className="steps">
      <div className="lightSpeedIn form" id="step2">
        <div className="main-heading">
          Изберете паркинг
        </div>
        <div className="check-field row">
          {items.map((item) => (
            <div className="tab-33 col-md-3" key={item.id}>
              <div className="check-field-single">
                <img src="assets/images/insurance_types/hand.png" alt="" />
                <input type="radio" name="insurance" value={item.name} onClick={() => chooseThis(item)} />
              </div>
              <span className="insurance-type">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev" onClick={goBack}>Previous Step</button>
      </div>
    </section>
  );
}
