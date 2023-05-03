import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../../utils/api";

function ReservationForm() {
    const initialState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };
    const [formData, setFormData] = useState({ ...initialState });
    const history = useHistory();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancel = () => {
        history.push("/dashboard");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createReservation(formData)
        .then( () => setFormData({ ...initialState }))
        
    };
    return (
        <form style={{ width: "50%" }} onSubmit={handleSubmit}>
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
                        pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
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
                <button>Submit</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default ReservationForm;
