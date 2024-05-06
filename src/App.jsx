/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './css/App.css';
import './css/animation.css';
import './css/responsive.css';
import React, { useState, useEffect } from 'react';
import AddVehicle from './components/AddVehicle';
import SelectCar from './components/SelectCar';
import SelectParking from './components/SelectParking';
import SelectParkingZone from './components/SelectParkingZone';
import SelectDuration from './components/SelectDuration';
import SelectedComponents from './components/SelectedComponents';

function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedParkingZone, setSelectedParkingZone] = useState(null);
  const [selectedDurationHours, setSelectedDurationHours] = useState(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const removeSelectedCar = () => {
    setSelectedCar(null);
  };
  const removeSelectedParking = () => {
    setSelectedParking(null);
  };
  const removeSelectedParkingZone = () => {
    setSelectedParkingZone(null);
    setSelectedDurationHours(null);
  };

  const reset = () => {
    setSelectedCar(null);
    setSelectedParking(null);
    setSelectedParkingZone(null);
    setSelectedParkingZone(null);
  };

  const carsStorageKey = 'recentCars';
  const recentZonesStorageKey = 'recentZones';
  const POCId = 1;
  const GradskiParkingId = 2;

  const parkingTypes = [
    {
      id: POCId,
      logo: './poclogoto.png',
      number: '141414',
      name: 'Паркинзи на општина Центар',
      zones: [
        { name: 'Зона 01', code: '01' },
        { name: 'Зона 0', code: '0' },
        { name: 'Зона 1', code: '1' },
        { name: 'Зона 2', code: '2' },
      ],
      recentZones: [],
      durations: [
        { name: '1 час', code: '1' },
        { name: '2 часа', code: '2' },
        { name: '3 часа', code: '3' },
        { name: '4 часа', code: '4' },
      ],
    },
    {
      id: GradskiParkingId,
      logo: './gradskiParking.jpeg',
      number: '144144',
      name: 'Паркинзи на Град Скопје',
      zones: [
        {
          name: 'A',
          children: [{ code: 'A0' },
            { code: 'A01' },
            { code: 'A05' },
            { code: 'A06' },
            { code: 'A3' },
            { code: 'A4' },
            { code: 'A8' }],
        },
        {
          name: 'B',
          children: [{ code: 'B2' },
            { code: 'B3' },
            { code: 'B6' },
            { code: 'B7' },
            { code: 'B10' }],
        },
        {
          name: 'C',
          children: [{ code: 'C8' },
            { code: 'C9' },
            { code: 'C15' },
            { code: 'C17' },
            { code: 'C19' },
            { code: 'C33' },
            { code: 'C35' },
            { code: 'C45' },
            { code: 'C46' },
            { code: 'C80' },
            { code: 'C81' }],
        },
        {
          name: 'D',
          children: [
            { code: 'D1' },
            { code: 'D2' },
            { code: 'D3' },
            { code: 'D4' },
            { code: 'D5' },
            { code: 'D6' },
            { code: 'D7' },
            { code: 'D8' },
            { code: 'D9' },
            { code: 'D40' },
            { code: 'D42' },
            { code: 'D63' },
          ],
        },

      ],
      recentZones: [],
      durations: [],
    },
  ];

  const smsLink = () => {
    if (selectedParkingZone === null || selectedCar === null || selectedParking === null) {
      return '';
    }
    const divider = isIOS ? '&' : '?';
    const afterBodySign = isIOS ? '=' : ':';
    const text = `${selectedParkingZone.code} ${selectedCar.plate} ${selectedDurationHours?.code ?? ''}`;
    const sms = `sms:${selectedParking.number}${divider}body${afterBodySign}${text.trim()}`;
    return sms;
  };

  useEffect(() => {
    const { userAgent } = window.navigator;

    // Check if user agent contains "Android"
    if (userAgent.match(/Android/i)) {
      setIsAndroid(true);
    }

    // Check if user agent contains "iPhone", "iPad", or "iPod"
    if (userAgent.match(/iPhone|iPad|iPod/i)) {
      setIsIOS(true);
    }

    // Additional check for macOS
    if (userAgent.match(/Macintosh|MacIntel|Mac OS X/i)) {
      setIsIOS(true); // Assuming macOS is equivalent to iOS for your purpose
    }
  }, []);

  return (
    <div className="row">
      <div className="tab-sm-100 col-md-12 steps-area">
        <form id="steps" method="post" encType="multipart/form-data">
          <div className="show-section wrapper">
            {/* <AddVehicle /> */}
            <SelectedComponents car={selectedCar} parking={selectedParking} zone={selectedParkingZone} duration={selectedDurationHours} />
            {selectedCar === null && <SelectCar setItem={setSelectedCar} />}
            {(selectedCar !== null && selectedParking === null)
                          && <SelectParking items={parkingTypes} setItem={setSelectedParking} goBack={removeSelectedCar} />}
            {((selectedParking !== null && selectedParkingZone === null) || selectedParking?.id === GradskiParkingId)
                          && <SelectParkingZone itemsToShow={selectedParking.zones} setItem={setSelectedParkingZone} goBack={removeSelectedParking} smsLink={smsLink} canSendSms={selectedParking?.id === GradskiParkingId && selectedParkingZone !== null} />}
            {(selectedParkingZone !== null && selectedParking?.id === POCId)
              && <SelectDuration itemsToShow={selectedParking.durations} setItem={setSelectedDurationHours} goBack={removeSelectedParkingZone} smsLink={smsLink} canSendSms={selectedDurationHours !== null} />}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
