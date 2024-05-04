/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import './css/App.css';
import './css/animation.css';
import './css/responsive.css';
import React, { useState } from 'react';
import AddVehicle from './components/AddVehicle';
import SelectCar from './components/SelectCar';
import SelectParking from './components/SelectParking';

function App() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const removeSelectedCar = () => {
    setSelectedCar(null);
  };

  return (
    <main className="overflow-hidden">
      <div className="row">
        <div className="tab-sm-100 col-md-12 steps-area">
          <form id="steps" method="post" encType="multipart/form-data">
            <div className="show-section wrapper">
              {selectedCar?.name}
              {/* <AddVehicle /> */}
              {selectedCar === null && <SelectCar setItem={setSelectedCar} />}
              {(selectedCar !== null && selectedParking === null) && <SelectParking setItem={setSelectedParking} goBack={removeSelectedCar} /> }
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default App;
