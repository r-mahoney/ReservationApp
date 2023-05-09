import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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
        <>
            <th>{first_name}</th>
            <th>{last_name}</th>
            <th>{mobile_number}</th>
            <th>{reservation_date}</th>
            <th>{reservation_time}</th>
            <th>{people}</th>
            <th><button><Link to={`/reservations/${reservation_id}/seat`} style={{"textDecoration":"none", "color":"black"}}>Seat</Link></button></th>
        </>
    );
}

export default ReservationDisplay;
