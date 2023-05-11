import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../layout/Reservations/Reservation-Display";
import TableDisplay from "../layout/Tables/Table-Display";
import { next, previous, today } from "../utils/date-time";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
    date,
    reservations,
    reservationsError,
    tables,
    loadDashboard,
}) {
    const history = useHistory();
    function handleNext() {
        history.push(`/dashboard?date=${next(date)}`);
    }

    function handlePrev() {
        history.push(`/dashboard?date=${previous(date)}`);
    }

    return (
        <main>
            <h1>Dashboard</h1>
            <button onClick={handlePrev}>Previous Day</button>
            <button
                onClick={() => history.push(`/dashboard?date=${today(date)}`)}
            >
                Today
            </button>
            <button onClick={handleNext}>Next Day</button>
            <div className="d-md-flex mb-3">
                <h4 className="mb-0">Reservations for date {date}</h4>
            </div>
            <ErrorAlert error={reservationsError} />
            <div>
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
                                <ReservationDisplay reservation={reservation} loadDashboard={loadDashboard}/>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Table Name</th>
                            <th>Capacity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr key={table.table_id}>
                                <TableDisplay table={table} loadDashboard={loadDashboard}/>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Dashboard;
