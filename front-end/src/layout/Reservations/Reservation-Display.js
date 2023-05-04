import React from "react";

function ReservationDisplay({ reservation }) {
    const {
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
        </>
    );
}

export default ReservationDisplay;
