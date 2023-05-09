import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../../utils/api";

function TableForm() {
    const initialFormData = {
        table_name: "",
        table_capacity: "",
    };

    const [formData, setFormData] = useState({ ...initialFormData });
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancel = () => {
        history.push(`/dashboard`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createTable(formData)
            .then(() => setFormData({ ...initialFormData }))
            .then(() => history.push(`/dashboard`));
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={{ width: "50%" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>
                        Table Name
                        <input
                            name="table_name"
                            value={formData.table_name}
                            onChange={handleChange}
                            required
                        ></input>
                    </label>
                    <label>
                        Table Capacity
                        <input
                            name="table_capacity"
                            value={formData.table_capacity}
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
