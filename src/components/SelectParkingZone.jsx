/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectParkingZone({ itemsToShow, setItem, goBack }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItems] = useState(itemsToShow);

  const chooseThis = (item) => {
    if (item.children) {
      setItems(item.children);
      return;
    }
    setSelectedItem(item);
    setItem(item);
  };

  return (
    <section className="steps">
      <div className="lightSpeedIn form" id="step2">
        <div className="main-heading">
          Изберете зона
          {' '}
          { selectedItem?.name}
        </div>
        <div className="check-field row">
          {items.map((item) => (
            <div className="tab-33 col-md-3" key={item.id ?? item.code ?? item.name}>
              <div className="check-field-single">
                <img src="assets/images/insurance_types/hand.png" alt="" />
                <input type="radio" name="insurance" value={item.name ?? item.code} onClick={() => chooseThis(item)} />
              </div>
              <span className="insurance-type">{item.name ?? item.code}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev" onClick={goBack}>Previous Step</button>
        <button type="button" id="step2btn" className="next">Next Step</button>
      </div>
    </section>
  );
}
