import React from "react";
import { deleteTable, updateStatus } from "../../utils/api";

function TableDisplay({ table, loadDashboard }) {
    const { table_name, capacity, table_status, table_id, reservation_id } = table;

    const handleFinish = () => {
        const abortController = new AbortController();

        window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
        )
            ? deleteTable(table_id, abortController.signal)
            .then(updateStatus(reservation_id, "finished", abortController.signal))
            .then(loadDashboard)
            : console.log("nothing");
    };

    return (
        <>
            <td>{table_name}</td>
            <td>{capacity}</td>
            <td data-table-id-status={table_id}>{table_status}</td>
            {table_status === "Occupied" && (
                <td>
                    <button
                        type="button"
                        data-table-id-finish={table_id}
                        onClick={handleFinish}
                    >
                        Finish
                    </button>
                </td>
            )}
        </>
    );
}

export default TableDisplay;
