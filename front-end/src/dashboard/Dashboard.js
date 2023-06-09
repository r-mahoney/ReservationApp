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
        <main className="container-fluid">
            <h1>Dashboard</h1>
            <div
                className="d-md-flex mb-3"
                style={{
                    disply: "flex",
                    flexDirection: "column"
                }}
            >
                <div>
                    <h4 className="mb-0">Reservations for date {date}</h4>
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        style={{ margin: "0 15px 0 12px" }}
                        onClick={handlePrev}
                    >
                        Previous Day
                    </button>
                    <button
                        style={{ margin: "0 15px" }}
                        className="btn btn-info"
                        onClick={() =>
                            history.push(`/dashboard?date=${today(date)}`)
                        }
                    >
                        Today
                    </button>
                    <button
                        style={{ margin: "0 15px" }}
                        className="btn btn-primary"
                        onClick={handleNext}
                    >
                        Next Day
                    </button>
                </div>
            </div>
            <ErrorAlert error={reservationsError} />
            <div className="table-responsive">
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
                        {reservations.map((reservation) => (
                            <tr key={reservation.reservation_id} style={{textAlign:"center"}}>
                                <ReservationDisplay
                                    reservation={reservation}
                                    loadDashboard={loadDashboard}
                                    resSearch={false}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Table Name</th>
                            <th scope="col">Capacity</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr key={table.table_id}>
                                <TableDisplay
                                    table={table}
                                    reservations={reservations}
                                    loadDashboard={loadDashboard}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Dashboard;
