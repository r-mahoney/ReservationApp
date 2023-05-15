import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../../utils/api";

function TableForm({ loadDashboard }) {
    const initialFormData = {
        table_name: "",
        capacity: "",
    };

    const [formData, setFormData] = useState({ ...initialFormData });
    const history = useHistory();

    const handleChange = (e) => {
        const value =
            e.target.name === "capacity"
                ? parseInt(e.target.value)
                : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleCancel = () => {
        history.goBack();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTable(formData)
            .then(loadDashboard)
            .then(() => setFormData({ ...initialFormData }))
            .then(() => history.push(`/dashboard`));
    };

    return (
        <>
            <h1>Create a New Table</h1>
            <form
                onSubmit={(e) => {
                    if (
                        formData.table_name.length < 2 ||
                        isNaN(formData.capacity) ||
                        formData.capacity === 0
                    ) {
                        e.preventDefault();
                    } else {
                        handleSubmit(e);
                    }
                }}
                style={{ width: "50%" }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{"display":"flex", "flexDirection":"column"}}>
                        Table Name
                        <input
                            name="table_name"
                            style={{ width: "50%" }}
                            value={formData.table_name}
                            onChange={handleChange}
                            placeholder="Table Name"
                            required
                        ></input>
                    </label>
                    <label style={{"display":"flex", "flexDirection":"column"}}>
                        Table Capacity
                        <input
                            name="capacity"
                            style={{ width: "50%" }}
                            placeholder="Table Capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        ></input>
                    </label>
                </div>
                <div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}

export default TableForm;
