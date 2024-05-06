/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectParkingZone({
  itemsToShow, setItem, goBack, smsLink, canSendSms,
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
          Зона
        </div>
        <div className="check-field row">
          {items.map((item) => (
            <div className="col-6 mb-4" key={item.id ?? item.code ?? item.name}>
              <div className="check-field-single">
                <span className="item-name">{item.code ?? item.name}</span>
                <input type="radio" value={item.name ?? item.code} onClick={() => chooseThis(item)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev" onClick={goBack}>Назад</button>
        {canSendSms && (<a href={smsLink()} className="next btn">SMS</a>)}
      </div>
    </section>
  );
}
