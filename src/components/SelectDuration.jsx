/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

export default function SelectDuration({
  itemsToShow, setItem, goBack, smsLink, canSendSms,
}) {
  const [items, setItems] = useState(itemsToShow);
  const [selectedItem, setSelectedItem] = useState(null);

  const chooseThis = (item) => {
    if (item.children) {
      setItems(item.children);
      return;
    }
    setSelectedItem(item);
    setItem(item);
  };

  const inputClass = (item) => {
    console.log('inputClass');
    if (selectedItem?.code === item.code) return 'checked-item';
    return '';
  };

  return (
    <>
      <div className="lightSpeedIn">
        <div className="content">
          <div className="main-heading">
            Период
          </div>
          <div className="check-field row">
            {items.map((item) => (
              <div className="col-6 mb-4" key={item.id ?? item.code ?? item.name}>
                <div className="check-field-single">
                  <span className="item-name">{item.name}</span>
                  <input type="radio" className={inputClass(item)} value={item.name} onClick={() => chooseThis(item)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="next-prev bottom">
        <button type="button" className="prev" onClick={goBack}>Назад</button>
        {canSendSms && (<a href={smsLink()} className="next btn">SMS</a>)}
      </div>
    </>
  );
}
