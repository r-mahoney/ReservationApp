import React from "react";

function TableDisplay({ table }) {
    const {table_name, capacity, table_status, table_id} = table
    return (
        <>
            <th>{table_name}</th>
            <th>{capacity}</th>
            <th data-table-id-status={table_id}>{table_status}</th>
        </>
    );
}

export default TableDisplay;