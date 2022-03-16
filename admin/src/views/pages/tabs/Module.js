/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Popconfirm, Input, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import service from "../../../services/onlyAdmin";
import { AntdMsg } from "../../../utils/Antd";

export default function Module() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Key',
            dataIndex: 'key',
            width: 200,
        },
        {
            title: 'Action',
            width: 90,
            render: (text, row) => (
                <>
                    <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                        <span className="d-flex">
                            <EditOutlined />
                        </span>
                    </Button>
                    <Button type="danger" size="small">
                        <span className="d-flex">
                            <Popconfirm
                                title="Are you sure to delete this admin?"
                                onConfirm={() => deleteConfirm(row._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                        </span>
                    </Button>
                </>
            ),
        },
    ].filter(item => !item.hidden);

    const list = (data) => {
        if (typeof data === 'undefined') {
            data = sdata;
        }
        setLoading(true);
        service.listModules(data).then(res => {
            let dt = data;
            dt.total = res.result?.total || 0;
            setSData({ ...dt });
            setData(res.result?.data || []);
        }).catch(err => {
            AntdMsg(err.message, 'error');
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteConfirm = (id) => {
        service.deleteModule(id).then(res => {
            AntdMsg(res.message);
            list();
        }).catch(err => {
            AntdMsg(err.message, 'error');
        })
    }

    useEffect(() => {
        list();
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Module List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'Name or Key' }} />
            </div>
            <AddForm ref={formRef} {...{ list }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const imgRef = useRef();

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            imgRef.current = {};
            setData(dt ? { ...dt } : { isActive: true });
            handleVisible(true);
        }
    }));

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }

    const save = () => {
        setAjxRequesting(true);
        data.photo = imgRef?.current?.uploadingFiles?.[0]?.base64;
        service.saveModule(data).then((res) => {
            AntdMsg(res.message);
            handleVisible(false);
            list();
        }).catch(err => {
            if (typeof err.message === 'object') {
                let dt = err.message[Object.keys(err.message)[0]];
                AntdMsg(dt, 'error');
            } else {
                AntdMsg(err.message, 'error');
            }
        }).finally(() => {
            setAjxRequesting(false);
        })

    }

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Module'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={400}
                className="app-modal-body-overflow"
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <form onSubmit={e => { e.preventDefault(); save() }} autoComplete="off" spellCheck="false">
                        <fieldset className="">
                            <div className="row mingap">
                                <div className="col-md-12 form-group">
                                    <label className="req">Title</label>
                                    <Input value={data.title || ''} onChange={e => handleChange(e.target.value, 'title')} />
                                </div>
                                <div className="col-md-12 form-group">
                                    <label className="req">Key</label>
                                    <Input value={data.key || ''} onChange={e => handleChange(e.target.value, 'key')} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
});