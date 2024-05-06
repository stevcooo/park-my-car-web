/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

export default function SelectedComponents({
  car, parking, zone, duration,
}) {
  const numberOfColumns = () => {
    const nonNull = [car, parking, zone, duration].filter(Boolean).length;
    if (nonNull < 4) return 'col-4';
    return 'col-3';
  };
  return (
    <section className="steps">
      <div className="lightSpeedIn form">
        <div className="check-field row">
          {car && (
          <div className={numberOfColumns()} key="car">
            <div className="check-field-single">
              <span className="item-name">{car?.name}</span>
              <span className="item-name">{car?.plate}</span>
            </div>
          </div>
          )}
          {parking && (
          <div className={numberOfColumns()} key="parking">
            <div className="check-field-single">
              <img src={parking?.logo} alt="" className="fit-image" />
            </div>
          </div>
          )}
          {zone && (
          <div className={numberOfColumns()} key="zone">
            <div className="check-field-single">
              <span className="item-name">{zone?.code ?? zone?.name}</span>
            </div>
          </div>
          )}
          {duration && (
          <div className={numberOfColumns()} key="duration">
            <div className="check-field-single">
              <span className="item-name">
                {duration.name}
              </span>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
