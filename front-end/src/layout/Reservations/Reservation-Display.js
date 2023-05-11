import React from "react";

function ReservationDisplay({ reservation }) {
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
    } = reservation;
    return (
        reservation && (
            <>
                <td>{first_name}</td>
                <td>{last_name}</td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td>
                    <button>
                        <a
                            href={`/reservations/${reservation_id}/seat`}
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Seat
                        </a>
                    </button>
                </td>
            </>
        )
    );
}

export default ReservationDisplay;
