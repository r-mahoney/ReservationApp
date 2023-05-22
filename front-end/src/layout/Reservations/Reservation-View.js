import React, { useEffect, useState } from "react";
import {
    useHistory,
    useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { readReservation, update, seatTable } from "../../utils/api";
import { asDateString } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";

function View({ loadDashboard, tables, reservations }) {
    const history = useHistory();
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState({});
    const [errors, setErrors] = useState([]);
    const [APIErrors, setAPIErrors] = useState(null);
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

    function validations() {
        const foundErrors = [];
    
        const foundTable = tables.find(
          (table) => table.table_id === Number(tableId)
        );
    
        if (!foundTable) {
          foundErrors.push({message:"The table you selected does not exist."});
        } else if (!reservation) {
          foundErrors.push({message:"This reservation does not exist."});
        } else {
          if (foundTable.status !== "Free") {
            foundErrors.push({message:"The table you selected is currently occupied"});
          }
          if (foundTable.capacity < people) {
            foundErrors.push(
              {message:`The table you selected cannot seat ${people} people.`}
            );
          }
        }
        setErrors(foundErrors);
    
        return foundErrors.length === 0;
      }

    const handleChange = (e) => {
        setTableId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        if (validations()) {
            seatTable(reservation_id, tableId, abortController.signal)
                .then(update(reservation, "seated", abortController.signal))
                .then(loadDashboard)
                .then(() => history.push("/dashboard"))
                .catch(setAPIErrors);
        }
        return () => abortController.abort();
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

        return () => abortController.abort();
    }, [reservationId]);

    return (
        <>
             <table className="table">
             <thead className="thead-light">
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Mobile Number</th>
                        <th scope="col">Reservation Date</th>
                        <th scope="col">Reservation Time</th>
                        <th scope="col">Party Size</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{first_name}</td>
                        <td>{last_name}</td>
                        <td>{mobile_number}</td>
                        <td>{date}</td>
                        <td>{reservation_time}</td>
                        <td>{people}</td>
                    </tr>
                </tbody>
            </table>
            <div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}
                >
                    <div>
                        {errors.map((error, id) => <ErrorAlert key={id} error={error} />)}
                        <ErrorAlert error={APIErrors} />
                    </div>
                    <label>
                        Select a Table
                        <select className="custom-select" name="table_id" onChange={handleChange}>
                            <option value="">--Select A Table--</option>
                            {tables.map((table) => {
                                return (
                                    <option
                                        value={table.table_id}
                                        key={table.table_id}
                                    >
                                        {table.table_name} - {table.capacity}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                    <button className="btn btn-primary" type="submit">Submit</button>
                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </form>
            </div>
        </>
    );
}

export default View;
