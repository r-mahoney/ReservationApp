import React, { useEffect, useState } from "react";
import {
    useHistory,
    useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { readReservation, listTables, seatTable } from "../../utils/api";
import { asDateString } from "../../utils/date-time";

function View() {
    const history = useHistory();
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState({});
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState();
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
    } = reservation;
    const date = asDateString(new Date(reservation_date));
    const handleChange = (e) => {
        setTableId(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        seatTable(reservation_id, tableId, abortController.signal);
        history.push("/dashboard")
    };
    const handleCancel = (e) => {
        history.goBack();
    };
    useEffect(() => {
        const abortController = new AbortController();
        async function loadReservation() {
            const data = await readReservation(reservationId);
            setReservation({ ...data });
        }
        loadReservation();
        listTables(abortController.signal).then(setTables);
    }, [reservationId]);

    return (
        <>
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
                    <tr>
                        <th>{first_name}</th>
                        <th>{last_name}</th>
                        <th>{mobile_number}</th>
                        <th>{date}</th>
                        <th>{reservation_time}</th>
                        <th>{people}</th>
                    </tr>
                </tbody>
            </table>
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>
                        Select a Table
                        <select name="table_id" onChange={handleChange}>
                            <option value="0">--Select A Table--</option>
                            {tables.map((table) => {
                                // if (table.table_status === "Free") {
                                    return (
                                        <option
                                            value={table.table_id}
                                            key={table.table_id}
                                        >
                                            {table.table_name} -{" "}
                                            {table.capacity}
                                        </option>
                                    );
                                // }
                                // return null;
                            })}
                        </select>
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </>
    );
}

export default View;
