import React from "react";
import { Link, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import { update } from "../../utils/api";

function ReservationDisplay({
    reservation,
    resSearch,
    loadSearchResults,
    loadDashboard,
}) {
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        status,
    } = reservation;
    const { path } = useRouteMatch();
    const handleCancel = () => {
        const abortController = new AbortController();
        return window.confirm(
            "Do you want to cancel this reservation? This cannot be undone."
        )
            ? update(
                  reservation,
                  "cancelled",
                  abortController.signal
              ).then(() => {
                  path.includes("edit") ? loadSearchResults() : loadDashboard();
              })
            : null;
    };
    return (
        <>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{mobile_number}</td>
            <td>{reservation_date}</td>
            <td>{reservation_time}</td>
            <td>{people}</td>
            <td data-reservation-id-status={reservation_id}>{status}</td>

            <td>
                <div style={{display:"flex", flexDirection:"column"}}>
                    {status === "booked" && !resSearch && (
                        <button
                            className="btn btn-sm btn-primary">
                            <Link
                                to={`/reservations/${reservation_id}/seat`}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                Seat
                            </Link>
                        </button>
                    )}
                    {status === "booked" && (
                        <button
                            className="btn btn-sm btn-secondary">
                            <Link
                                to={`/reservations/${reservation_id}/edit`}
                                style={{
                                    textDecoration: "none",
                                    color: "black",
                                }}
                            >
                                Edit
                            </Link>
                        </button>
                    )}
                    {reservation.status !== "cancelled" && (
                        <button
                            className="btn btn-sm btn-danger"
                            data-reservation-id-cancel={`${reservation_id}`}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </td>
        </>
    );
}

export default ReservationDisplay;
