import React, { useEffect, useState } from "react";
import {
    useParams,
    useRouteMatch,
} from "react-router-dom/cjs/react-router-dom.min";
import { readReservation } from "../../utils/api";
import Form from "./Form";

function ReservationForm({ date, loadDashboard }) {
    const { path } = useRouteMatch();
    const { reservationId } = useParams();

    const [reservation, setReservation] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (path.includes("edit")) {
            const abortcontroller = new AbortController();
            readReservation(reservationId, abortcontroller.signal)
                .then((data) => setReservation(data))
                .then(()=> setIsLoading(false));
        } else {
            setIsLoading(false)
        }
    }, [reservationId, path]);

    return (
        <>
            {path.includes("edit") ? <h1>Edit a Reservation</h1>:<h1>Create a New Reservation</h1>}
            <div style={{ display: "none" }} id="alert-Div" className="alert">
                Alert
            </div>
            {!isLoading && <Form reservation={reservation} date={date} loadDashboard={loadDashboard}/>}
        </>
    );
}

export default ReservationForm;
