/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

export default function SelectParking({ items, setItem, goBack }) {
  const chooseThis = (item) => {
    setItem(item);
  };

  return (
    <>
      <div className="lightSpeedIn">
        <div className="content">
          <div className="main-heading">Паркинг</div>
          <div className="check-field row">
            {items.map((item) => (
              <div className="col-6" key={item.id} onClick={() => chooseThis(item)}>
                <div className="check-field-single">
                  {item.logo && <img src={item.logo} alt="" className="fit-image" />}
                  <input type="radio" value={item.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="next-prev bottom">
        <button type="button" className="prev" onClick={goBack}>
          Назад
        </button>
      </div>
    </>
  );
}
