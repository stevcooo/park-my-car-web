/* eslint-disable jsx-a11y/label-has-associated-control */
// I need react component with two inputs
export default function AddVehicle() {
  return (
    <section className="steps">
      <div className="lightSpeedIn">
        <div className="main-heading">
          Додади возило
        </div>
        <div className="input-field row">
          <div className="col-md-3 text-end">
            <label>Возило</label>
          </div>
          <div className="col-md-9">
            <input type="text" name="name" />
          </div>
        </div>
        <div className="input-field row">
          <div className="col-md-3 text-end">
            <label>Регистрација</label>
          </div>
          <div className="col-md-9">
            <input type="text" name="mail" />
          </div>
        </div>
      </div>
      <div className="next-prev">
        <button type="button" className="prev">Откажи</button>
        <button type="button" className="next">Додади</button>
      </div>
    </section>
  );
}
