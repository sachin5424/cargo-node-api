import { useState, useEffect, useRef } from "react";
import { Button, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import service from "../../../services/admin";
import { AntdMsg } from "../../../utils/Antd";
import UploadImage, { AntdSelect, AntdDatepicker } from "../../../utils/Antd";

export default function EditProfile(props) {
    const {callback} = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [data, setData] = useState({});
    let imgRef = useRef([]);

    const list = (data) => {
        setAjxRequesting(true);
        service.details(data).then(res => {
            setData(res.result?.data || {});
        }).catch(err => {
            AntdMsg(err.message, 'error');
        }).finally(() => {
            setAjxRequesting(false);
        })
    }

    const save = () => {
        setAjxRequesting(true);
        let fd = new FormData();

        for (const [key, value] of Object.entries(data)) {
            fd.append(key, value);
        }

        fd.delete('image');
        if (typeof imgRef.current.uploadingFiles !== 'undefined') {
            fd.append('image', imgRef.current.uploadingFiles[0]);
        }

        service.save(fd).then((res) => {
            AntdMsg(res.message);
            callback();
        }).catch(err => {
            if (typeof err.message === 'object') {
                AntdMsg(err.message[Object.keys(err.message)[0]], 'error');
            } else {
                AntdMsg(err.message, 'error');
            }
        }).finally(() => {
            setAjxRequesting(false);
        })
    }

    useEffect(() => {
        list()
    }, []);

    const handleChange = (v, k) => {
        setData({ ...data, [k]: v });
    }
    return (
        <>
            <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                <div className="d-flex">
                    <div className="row w-100">
                        <div className="col-md-9">
                            <div className="d-flex my-3">
                                <span className="w100 text-secondary text-bold">Name :</span>
                                <Input value={data.name || ''} onChange={e => handleChange(e.target.value, 'name')} />
                            </div>
                            <div className="d-flex my-3">
                                <span className="w100 text-secondary text-bold">username :</span>
                                <Input value={data.username || ''} onChange={e => handleChange(e.target.value, 'username')} />
                            </div>
                            <div className="d-flex my-3">
                                <span className="w100 text-secondary text-bold">email :</span>
                                <Input value={data.email || ''} onChange={e => handleChange(e.target.value, 'email')} />
                            </div>
                        </div>
                        <div className="col-md-3 my-3">
                            <UploadImage ref={imgRef} {...{ fileCount: 1, files: data.image ? [data.image] : [] }} />
                        </div>
                        <div className="row col-md-12">
                            <div className="col-md-6 d-flex my-3 ">
                                <span className="w100 text-secondary text-bold">Mobile :</span>
                                <Input value={data.mobile || ''} onChange={e => handleChange(e.target.value, 'mobile')} />
                            </div>
                            <div className="col-md-6 d-flex my-3">
                                <span className="w100 text-secondary text-bold">Gender :</span>
                                <AntdSelect
                                    options={[{ value: 'male', label: "Male" }, { value: 'female', label: "Female" }, { value: 'other', label: "Other" }]}
                                    value={data.gender}
                                    onChange={v => { handleChange(v, 'gender') }}
                                />
                            </div>
                            <div className="col-md-6 d-flex my-3">
                                <span className="w100 text-secondary text-bold">DOB :</span>
                                <AntdDatepicker format="MMMM D, YYYY" value={(data.dob || '') + ''} onChange={value => { handleChange(value, 'dob') }} />
                            </div>
                            <div className="col-md-12 d-flex my-3">
                                <span className="w100 text-secondary text-bold">Address :</span>
                                <Input.TextArea value={data.address || ''} onChange={e => handleChange(e.target.value, 'address')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex mt-2">
                    <Button type="primary" className="ml-auto w100" onClick={save} disabled={ajxRequesting}>Save</Button>
                </div>
            </Spin>
        </>
    );
}