/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectDuration({
  itemsToShow, setItem, goBack, smsLink,
}) {
  const [items, setItems] = useState(itemsToShow);

  const chooseThis = (item) => {
    if (item.children) {
      setItems(item.children);
      return;
    }
    setItem(item);
  };

  return (
    <section className="steps">
      <div className="lightSpeedIn form" id="step2">
        <div className="main-heading">
          Изберете период
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
        <a href={smsLink()} className="next btn">SMS</a>
      </div>
    </section>
  );
}
