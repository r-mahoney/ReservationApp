import React, { useEffect, useState } from "react";

import { listReservations, listTables } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "./Reservations/Reservation-Form";
import TableForm from "./Tables/Table-Form";
import View from "./Reservations/Reservation-View";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [tables, setTables] = useState([]);
    const query = useQuery();
    const date = query.get("date") ? query.get("date") : today();
    
    useEffect(loadDashboard, [date]);

    function loadDashboard() {
        const abortController = new AbortController();
    
        setReservationsError(null);
    
        listReservations({ date }, abortController.signal)
          .then(setReservations)
          .catch(setReservationsError);
    
        listTables(abortController.signal)
          .then(setTables)
    
        return () => abortController.abort();
      }

    return (
        <Switch>
            <Route exact={true} path="/">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations/new">
                <ReservationForm date={today()}  loadDashboard={loadDashboard}/>
            </Route>
            <Route exact={true} path="/reservations/:reservationId/seat">
                <View loadDashboard={loadDashboard}/>
            </Route>
            <Route exact={true} path="/tables/new">
                <TableForm  loadDashboard={loadDashboard}/>
            </Route>
            <Route path="/dashboard">
                <Dashboard date={date}
                loadDashboard={loadDashboard}
                reservations={reservations}
                tables={tables}
                reservationsError={reservationsError} />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;
