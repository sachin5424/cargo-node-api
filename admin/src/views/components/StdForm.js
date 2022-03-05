import { useState, useEffect } from "react";

import sdt from "../../services/sdt";
import { AntdSelect } from "../../utils/Antd";

export default function SdtForm({ parData = {}, parHandleChange = () => { }, col = 3 }) {
    const [data, setData] = useState({ ...parData });
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }
    const checkDistrictExist = () => states?.find(v => v._id === data.state)?.districts.map(v => v._id)?.includes(data.district);
    const checkTalukExist = () => states?.find(v => v._id === data.state)?.districts.find(v => v._id === data.district)?.taluks?.map(v => v._id)?.includes(data.taluk);


    useEffect(() => {
        sdt.listSdt().then(res => { setStates(res.result.data) });
    }, [])

    useEffect(() => {
        const newDistricts = states.find(v => v._id === data.state)?.districts || [];
        setDistricts(newDistricts?.map(v => ({ value: v._id, label: v.name, taluks: v.taluks })) || [])
    }, [data.state])

    useEffect(() => {
        const newTaluks = districts?.find(v => v.value === data.district)?.taluks || [];
        setTaluks(newTaluks?.map(v => { return { value: v._id, label: v.name } }));
    }, [data.district, districts]);

    useEffect(() => {
        if (!checkDistrictExist()) {
            handleChange('', 'district');
        }
    }, [data.state]);

    useEffect(() => {
        if (!checkTalukExist()) {
            handleChange('', 'taluk');
        }
    }, [data.district, districts]);

    useEffect(() => { parHandleChange(data.state, 'state') }, [data.state]);
    useEffect(() => { parHandleChange(data.district, 'district') }, [data.district]);
    useEffect(() => { parHandleChange(data.taluk, 'taluk') }, [data.taluk]);

    return (
        <>
            <div className={`col-md-${col} form-group`}>
                <label className="req">State</label>
                <AntdSelect
                    options={states.map(v => ({ value: v._id, label: v.name }))}
                    value={data.state}
                    onChange={v => { handleChange(v, 'state') }}
                />
            </div>
            <div className={`col-md-${col} form-group`}>
                <label className="req">District</label>
                <AntdSelect
                    options={districts || []}
                    value={data.district}
                    onChange={v => { handleChange(v, 'district') }}
                />
            </div>
            <div className={`col-md-${col} form-group`}>
                <label className="req">Taluk</label>
                <AntdSelect
                    options={taluks || []}
                    value={data.taluk}
                    onChange={v => { handleChange(v, 'taluk') }}
                />
            </div>
        </>
    );
}