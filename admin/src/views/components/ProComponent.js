/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { AntdSelect } from "../../utils/Antd";
import config from "../../rdx";

export function UserTypeSelect({ data: parData, handleChange, key = 'type' }) {
    const [data, setData] = useState({ ...parData });
    const options = config.userType === 'superAdmin'
        ? [{ value: 'stateAdmin', label: "State Admin" }, { value: 'districtAdmin', label: "District Admin" }, { value: 'talukAdmin', label: "Taluk Admin" }]
        : config.userType === 'stateAdmin'
            ? [{ value: 'districtAdmin', label: "District Admin" }, { value: 'talukAdmin', label: "Taluk Admin" }]
            : config.userType === 'talukAdmin'
                ? [{ value: 'talukAdmin', label: "Taluk Admin" }]
                : [];

    useEffect(() => {
        setData({ ...parData });
    }, [parData[key]]);

    return (
        <>
            <AntdSelect
                options={options}
                value={data[key]}
                onChange={v => { handleChange(v, key) }}
            />

        </>
    );
}

