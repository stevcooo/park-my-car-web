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
  const itemContainerClass = () => 'check-field-single bordered';
  return (
    <div className="row p-18">
      {car && (
        <div className={numberOfColumns()} key="car">
          <div className={itemContainerClass()}>
            <span className="text-to-fit">Регистрација</span>
            <span className="text-to-fit">{car?.plate}</span>
          </div>
        </div>
      )}
      {parking && (
        <div className={numberOfColumns()} key="parking">
          <div className={itemContainerClass()}>
            <span className="text-to-fit">Паркинг</span>
            <img src={parking?.logo} alt="" className="fit-image" />
          </div>
        </div>
      )}
      {zone && (
        <div className={numberOfColumns()} key="zone">
          <div className={itemContainerClass()}>
            <span className="text-to-fit">Зона</span>
            <span className="text-to-fit">{zone?.code ?? zone?.name}</span>
          </div>
        </div>
      )}
      {duration && (
        <div className={numberOfColumns()} key="duration">
          <div className={itemContainerClass()}>
            <span className="text-to-fit">Време</span>
            <span className="text-to-fit">
              {duration.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
