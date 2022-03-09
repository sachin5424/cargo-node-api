import { useState, useEffect } from "react";
import { AntdSelect } from "../../utils/Antd";
import config from "../../rdx";

export function ServiceType({ data: parData, handleChange, key = 'serviceType', col = 3 }) {
    const [data, setData] = useState({ ...parData });

    useEffect(() => {
        setData({ ...parData });
    }, [parData[key]]);

    useEffect(() => {
        if (config.serviceType !== 'all') {
            handleChange(config.serviceType, key)
        }
    }, []);

    return (
        <>
            {
                config.serviceType === 'all'
                    ? <div className={`col-md-${col} form-group`}>
                        <label className="req">Service Type</label>
                        <AntdSelect
                            options={[{ value: 'cargo', label: "Cargo" }, { value: 'taxi', label: "Taxi" }]}
                            value={data[key]}
                            onChange={v => { handleChange(v, key) }}
                        />
                    </div>
                    : <></>
            }

        </>
    );
}

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

