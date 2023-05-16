import React, { useState } from "react";
import { createReservation, update } from "../../utils/api";
import {
  useHistory,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom.min";

function Form({ reservation, date, loadDashboard }) {
  const today = new Date();
  const { path } = useRouteMatch();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const initialState = path.includes("edit")
    ? {
        first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date:
          reservation.reservation_date.match(/\d\d\d\d-\d\d-\d\d/)[0],
        reservation_time: reservation.reservation_time,
        people: reservation.people,
      }
    : {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "0",
      };

  const [formData, setFormData] = useState({ ...initialState });
  const history = useHistory();

  const handleChange = (e) => {
    const value =
      e.target.name === "people" ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    document.getElementById("alert-Div").style.display = "none";
    document.getElementById("alert-Div").classList.remove("alert-danger");
    document.getElementById("alert-Div").innerHTML = "";
  };

  let reservationDay = new Date(formData.reservation_date.replace(/-/g, "/"));

  const handleCancel = () => {
    history.push(`/dashboard`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();

    path.includes("edit")
      ? update(
          { ...reservation, ...formData },
          "booked",
          abortController.signal
        )
          .then(loadDashboard)
          .then(() => setFormData({ ...initialState }))
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
      : createReservation(formData, abortController.signal)
          .then(loadDashboard)
          .then(() => setFormData({ ...initialState }))
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          );
  };
  return (
    <form
      style={{ width: "50%" }}
      onSubmit={(e) => {
        if (
          reservationDay.getDay() === 2 ||
          new Date(
            formData.reservation_date + " " + formData.reservation_time
          ) < new Date(date + " " + time) ||
          new Date(
            formData.reservation_date + " " + formData.reservation_time
          ) < new Date(`${formData.reservation_date} 10:30`) ||
          new Date(
            formData.reservation_date + " " + formData.reservation_time
          ) > new Date(`${formData.reservation_date} 21:30`)
        ) {
          e.preventDefault();
          document.getElementById("alert-Div").classList.add("alert-danger");
          document.getElementById("alert-Div").style.display = "block";
          document.getElementById("alert-Div").innerHTML =
            "Reservation must not be on a Tuesday or in the past";
        } else if (formData.mobile_number.match(/[a-z]/i)) {
          e.preventDefault();
          document.getElementById("alert-Div").classList.add("alert-danger");
          document.getElementById("alert-Div").style.display = "block";
          document.getElementById("alert-Div").innerHTML =
            "Mobile number is invalid";
        } else {
          handleSubmit(e);
        }
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column" }}
        className="form-group"
      >
        <label style={{ display: "flex", flexDirection: "column" }}>
          First name:
          <input
            name="first_name"
            style={{ width: "50%" }}
            placeholder="First"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Last name:
          <input
            name="last_name"
            style={{ width: "50%" }}
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last"
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Mobile number:
          <input
            type="tel"
            name="mobile_number"
            placeholder="1234567890"
            style={{ width: "50%" }}
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Date of reservation:
          <input
            type="date"
            name="reservation_date"
            style={{ width: "50%" }}
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            value={formData.reservation_date}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Time of reservation:
          <input
            type="time"
            name="reservation_time"
            style={{ width: "50%" }}
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            value={formData.reservation_time}
            onChange={handleChange}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column" }}>
          Size of party:
          <input
            type="number"
            id="people"
            name="people"
            onChange={handleChange}
            value={formData.people}
            min="1"
            max="10"
            style={{ width: "50%" }}
            required
          />
        </label>
      </div>
      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default Form;
