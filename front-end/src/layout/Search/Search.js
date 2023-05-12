import React, { useState } from "react";
import { listReservations } from "../../utils/api";
import ReservationDisplay from "../Reservations/Reservation-Display";
import formatReservationDate from "../../utils/format-reservation-date";

function Search() {
    const initialFormData = {
        mobile_number: "",
    };
    const [formData, setFormData] = useState({ ...initialFormData });
    const [foundReservations, setfoundReservations] = useState({});
    const [changed, setChanged] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        listReservations(
            { mobile_number: formData.mobile_number },
            false,
            abortController.signal
        )
            .then(formatReservationDate)
            .then(setfoundReservations)
            .then(setChanged(true));
        setFormData({ ...initialFormData });
    };
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <>
            <div>
                <h1>Search for Reservation</h1>
                {changed && foundReservations.length < 1 && <div
                    style={{ display: "block" }}
                    id="alert-Div"
                    className="alert alert-danger"
                >
                    No reservations found
                </div>}
                <form onSubmit={handleSubmit}>
                    <label style={{ display: "block", width: "100%" }}>
                        Search for Reservation
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <input
                                type="text"
                                name="mobile_number"
                                value={formData.mobile_number}
                                placeholder="Enter a customer's phone number"
                                style={{ display: "flex", width: "100%" }}
                                onChange={handleChange}
                            ></input>
                            <button style={{ marginLeft: "5px" }} type="submit">
                                Find
                            </button>
                        </div>
                    </label>
                </form>
            </div>
            <div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Reservation Date</th>
                            <th scope="col">Reservation Time</th>
                            <th scope="col">Party Size</th>
                            <th scope="col">Reservation Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foundReservations.length > 0 &&
                            foundReservations.map((reservation) => (
                                <tr key={reservation.reservation_id}>
                                    <ReservationDisplay
                                        reservation={reservation}
                                        resSearch={true}
                                    />
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Search;
