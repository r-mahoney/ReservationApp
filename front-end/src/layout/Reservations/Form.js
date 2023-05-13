import React, { useState } from "react";
import { createReservation } from "../../utils/api";
import {
    useHistory,
    useRouteMatch,
} from "react-router-dom/cjs/react-router-dom.min";

function Form({reservation, date, loadDashboard}) {
    const today = new Date();
    const { path } = useRouteMatch();
    const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const initialState = path.includes("edit")
        ? {
              first_name: reservation.first_name,
              last_name: reservation.last_name,
              mobile_number: reservation.mobile_number,
              reservation_date: reservation.reservation_date.match(/\d\d\d\d-\d\d-\d\d/)[0],
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
            e.target.name === "people"
                ? parseInt(e.target.value)
                : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
        document.getElementById("alert-Div").style.display = "none";
        document.getElementById("alert-Div").classList.remove("alert-danger");
    };

    // let reservationDay = !isLoading ? new Date(formData.reservation_date.replace(/-/g, "/")) : null;

    const handleCancel = () => {
        history.push(`/dashboard`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        path.includes("edit") 
        ? console.log("editing")
        : createReservation(formData)
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
                    // reservationDay.getDay() === 2 ||
                    new Date(
                        formData.reservation_date +
                            " " +
                            formData.reservation_time
                    ) < new Date(date + " " + time) ||
                    new Date(
                        formData.reservation_date +
                            " " +
                            formData.reservation_time
                    ) < new Date(`${formData.reservation_date} 10:30`) ||
                    new Date(
                        formData.reservation_date +
                            " " +
                            formData.reservation_time
                    ) > new Date(`${formData.reservation_date} 21:30`)
                ) {
                    e.preventDefault();
                    document
                        .getElementById("alert-Div")
                        .classList.add("alert-danger");
                    document.getElementById("alert-Div").style.display =
                        "block";
                } else {
                    handleSubmit(e);
                }
            }}
        >
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label>
                    First name:
                    <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last name:
                    <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Mobile number:
                    <input
                        name="mobile_number"
                        placeholder="(123)-456-7890"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Date of reservation:
                    <input
                        type="date"
                        name="reservation_date"
                        style={{ width: "189px" }}
                        placeholder="YYYY-MM-DD"
                        pattern="\d{4}-\d{2}-\d{2}"
                        value={formData.reservation_date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Time of reservation:
                    <input
                        type="time"
                        name="reservation_time"
                        style={{ width: "189px" }}
                        placeholder="HH:MM"
                        pattern="[0-9]{2}:[0-9]{2}"
                        value={formData.reservation_time}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Size of party:
                    <input
                        type="number"
                        id="people"
                        name="people"
                        onChange={handleChange}
                        value={formData.people}
                        min="1"
                        max="10"
                        style={{ width: "189px" }}
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
