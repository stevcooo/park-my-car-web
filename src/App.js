import logo from './logo.svg';
import './App.css';
import './animation.css';
import './responsive.css';

function App() {
  return (
    <main className="overflow-hidden">
        <div className="row">
            <div className="tab-sm-100 col-md-12 steps-area">
                <form id="steps" method="post" enctype="multipart/form-data">
                    <div className="show-section wrapper">
                        <section className="steps">
                            <div className="lightSpeedIn form" id="step1">
                                <div className="main-heading">
                                    Додади возило
                                </div>
                                <div className="input-field row">
                                    <div className="col-md-3 text-end">
                                        <label>Возило</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="name" id="vehicleName"/>
                                    </div>
                                </div>
                                <div className="input-field row">
                                    <div className="col-md-3 text-end">
                                        <label>Регистрација</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="mail" id="vehiclePlate"/>
                                    </div>
                                </div>
                            </div>
                             <div className="next-prev">
                                <button type="button" id="vehicleCancel" className="prev">Откажи</button>
                                <button type="button" id="vehicleAdd" className="next">Додади</button>
                            </div>
                        </section>
                         <section className="steps">
                            <div className="lightSpeedIn form" id="step2">
                                <div className="main-heading">
                                    Choose insurance
                                </div>
                                <div className="check-field row">
                                    <div className="tab-33 col-md-3">
                                        <div className="check-field-single">
                                            <img src="assets/images/insurance_types/hand.png" alt=""/>
                                            <input checked type="radio" name="insurance" value="Individual Life Plans"/>
                                        </div>
                                        <span className="insurance-type">Individual Life Plans</span>
                                    </div>
                                    <div className="tab-33 col-md-3">
                                        <div className="check-field-single">
                                            <img src="assets/images/insurance_types/protect.png" alt=""/>
                                            <input type="radio" name="insurance" value="Child Protection"/>
                                        </div>
                                        <span className="insurance-type">Child Protection</span>
                                    </div>
                                    <div className="tab-33 col-md-3">
                                        <div className="check-field-single">
                                            <img src="assets/images/insurance_types/family-insurance.png" alt=""/>
                                            <input type="radio" name="insurance" value="Whole Life Assurance"/>
                                        </div>
                                        <span className="insurance-type">Whole Life Assurance</span>
                                    </div>
                                    
                                    <div className="tab-33 col-md-3">
                                        <div className="check-field-single">
                                            <img src="assets/images/insurance_types/quality-assurance.png" alt=""/>
                                            <input type="radio" name="insurance" value="Endowment Assurance"/>
                                        </div>
                                        <span className="insurance-type">Endowment Assurance</span>
                                    </div>
                                    <div className="tab-33 col-md-3">
                                        <div className="check-field-single">
                                            <img src="assets/images/insurance_types/contract.png" alt=""/>
                                            <input type="radio" name="insurance" value="Death Claims"/>
                                        </div>
                                        <span className="insurance-type">Death Claims</span>
                                    </div>
                                </div>
                                <div className="input-field row">
                                    <div className="col-md-6">
                                        <label for="liability">
                                            Liability Limit Needed
                                        </label>
                                        <div className="select-field">
                                            <select name="liability" id="liability" required>
                                                <option value="$2 million">$2 million</option>
                                                <option value="$3 million">$3 million</option>
                                                <option value="$4 million">$4 million</option>
                                            </select>
                                            <span></span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label for="years">
                                            Home Many Years
                                        </label>
                                        <div className="select-field">
                                            <select name="years" id="years">
                                                <option value="20 Years">20 Years</option>
                                                <option value="30 Years">30 Years</option>
                                                <option value="40 Years">40 Years</option>
                                            </select>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-field row">
                                    <div className="text-start">
                                        <label>Home Address</label>
                                    </div>
                                    <div className="col-md-12">
                                        <input required type="text" name="home-address" id="home-address"/>
                                    </div>
                                </div>
                            </div>
                            <div className="next-prev">
                                <button type="button" className="prev">Previous Step</button>
                                <button type="button" id="step2btn" className="next">Next Step</button>
                            </div>
                        </section>
                        <section className="steps">
                            <div className="lightSpeedIn form" id="step3">
                                <div className="main-heading">Financial Products</div>
                                <div className="block pt-5 pb-4 mb-4">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="step3-img">
                                                <img src="assets/images/step3-atr.jpg" alt="Body Policy"/>
                                            </div>
                                            <span className="img-text">Body Policy</span>
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-field row">
                                                <div className="mb-3 text-start">
                                                    <label>Sum Assured (Dollar):</label>
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="text" name="dollar" id="dollar" placeholder="$44,880.00"/>
                                                </div>
                                            </div>
                                            <div className="input-field row">
                                                <div className="mb-4  tab-100 col-md-6">
                                                    <label for="mode"  className="mb-3">
                                                        Premium Mode
                                                    </label>
                                                    <div className="select-field">
                                                        <select name="mode" id="mode" required>
                                                            <option value="Basic Plan 2 Million">Basic Plan 2 Million</option>
                                                            <option value="Standard Plan 3 Million">Standard Plan 3 Million</option>
                                                            <option value="Premium Plan 5 Million">Premium Plan 5 Million</option>
                                                        </select>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div className="mb-4 tab-100 col-md-6">
                                                    <label for="years" className="mb-3">
                                                        Gender
                                                    </label>
                                                    <div className="gender-field">
                                                        <div className="row">
                                                            <div className="offset-md-1 col-md-5">
                                                                <div className="gender-single border-end">
                                                                    <input checked type="radio" name="gender" value="Male"/>
                                                                    <label>Male</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-5">
                                                                <div className="gender-single">
                                                                    <input type="radio" name="gender" value="Female"/>
                                                                    <label>Female</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input-field mb-3 mt-3">
                                            <label for="term" className="mb-3">
                                                Choose a Term of Assurance
                                            </label>
                                            <div className="select-field">
                                                <select name="term" id="term">
                                                    <option value="Basic Information">Basic Information</option>
                                                    <option value="Advanced Information">Advanced Information</option>
                                                    <option value="Lifetime Information">Lifetime Information</option>
                                                </select>
                                                <span></span>
                                            </div>
                                        </div>  
                                    </div>
                                </div>
                                <div className="upload-area">
                                    <div className="main-heading">
                                        Upload Files
                                    </div>
                                    <label className="upload-area-inner">
                                        <input type="file" name="file" id="file"/>
                                        <i className="upload-icon fa-solid fa-cloud-arrow-up"></i>
                                        <span>Click & select a File to Upload</span>
                                        <a className="upload-button">
                                            Upload Now!
                                        </a>
                                    </label>
                                </div>      
                            </div>
                            <div className="next-prev">
                                <button type="button" className="prev">Previous Step</button>
                                <button id="sub" type="button" className="apply">Send</button>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    </main>
  );
}

export default App;
