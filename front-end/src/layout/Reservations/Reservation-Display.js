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
        <>
            <th>{first_name}</th>
            <th>{last_name}</th>
            <th>{mobile_number}</th>
            <th>{reservation_date}</th>
            <th>{reservation_time}</th>
            <th>{people}</th>
            <th><button><a href={`/reservations/${reservation_id}/seat`} style={{"textDecoration":"none", "color":"black"}}>Seat</a></button></th>
        </>
    );
}

export default ReservationDisplay;
