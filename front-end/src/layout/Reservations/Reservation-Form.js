import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../../utils/api";

function ReservationForm({ date }) {
    const today = new Date();
    const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const initialState = {
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

    let reservationDay = new Date(formData.reservation_date.replace(/-/g, "/"));

    const handleCancel = () => {
        history.push(`/dashboard`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createReservation(formData)
            .then(() => setFormData({ ...initialState }))
            .then(() =>
                history.push(`/dashboard?date=${formData.reservation_date}`)
            );
    };

    return (
        <>
            <div style={{ display: "none" }} id="alert-Div" className="alert">
                Alert
            </div>
            <form
                style={{ width: "50%" }}
                onSubmit={(e) => {
                    if (
                        reservationDay.getDay() === 2 ||
                        new Date(
                            formData.reservation_date +
                                " " +
                                formData.reservation_time
                        ) < new Date(date + " " + time) ||
                        new Date(
                            formData.reservation_date +
                                " " +
                                formData.reservation_time
                        ) < new Date(`${formData.reservation_date} 10:30:00`) ||
                        new Date(
                            formData.reservation_date +
                                " " +
                                formData.reservation_time
                        ) > new Date(`${formData.reservation_date} 17:30:00`)
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
                        />
                    </label>
                    <label>
                        Last name:
                        <input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Mobile number:
                        <input
                            name="mobile_number"
                            placeholder="(123)-456-7890"
                            value={formData.mobile_number}
                            onChange={handleChange}
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
        </>
    );
}

export default ReservationForm;
