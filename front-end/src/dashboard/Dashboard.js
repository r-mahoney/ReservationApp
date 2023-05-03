import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../layout/Reservations/Reservation-Display";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const queryParams = new URLSearchParams(window.location.search);
    const setDate = queryParams.get("date");
    const initialDate = setDate ? setDate : date;

    const [queryDate, setQueryDate] = useState(initialDate);

    function handleNext() {
        let array = queryDate.split("-");
        array[2] = `${parseInt(array[2]) + 1}`.padStart(2, "0");
        setQueryDate(array.join("-"));
        queryParams.set("date", array);
    }

    function handlePrev() {
        let array = queryDate.split("-");
        array[2] = `${parseInt(array[2]) - 1}`.padStart(2, "0");
        setQueryDate(array.join("-"));
        queryParams.append("date", array);
    }

    useEffect(loadDashboard, [queryDate, date]);

    function loadDashboard() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date: queryDate }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        return () => abortController.abort();
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <button onClick={handlePrev}>Previous Day</button>
            <button onClick={() => setQueryDate(date)}>Today</button>
            <button onClick={handleNext}>Next Day</button>
            <div className="d-md-flex mb-3">
                <h4 className="mb-0">Reservations for date {queryDate}</h4>
            </div>
            <ErrorAlert error={reservationsError} />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile Number</th>
                        <th>Reservation Date</th>
                        <th>Reservation Time</th>
                        <th>Party Size</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reservation_id}>
                            <ReservationDisplay reservation={reservation} />
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

export default Dashboard;
