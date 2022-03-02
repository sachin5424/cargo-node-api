/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, forwardRef, useState, useImperativeHandle, useEffect } from "react";
import MyTable from "../../components/MyTable";
import { Button, Modal, Tag, Spin } from "antd";
import { MultiChechBox } from "../../../utils/Antd";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { AntdMsg } from "../../../utils/Antd";
import admService from "../../../services/onlyAdmin";
import config from "../../../rdx";


export default function AssignPermission() {

    const [data, setData] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    const formRef = useRef();
    let [sdata, setSData] = useState({ key: '', page: 1, limit: 20, total: 0 });
    const columns = [
        {
            title: 'User Type',
            dataIndex: 'typeName',
            width: 150,
        },
        {
            title: 'Granted Modules',
            dataIndex: 'grantedModuleTitles',
            render: (data, row) => (
                data.map((v, i) => {
                    return <Tag color={
                        i % 4 === 0
                            ? 'blue'
                            : i % 4 === 1
                                ? 'gold'
                                : i % 4 === 2
                                    ? 'cyan'
                                    : 'pink'
                    } key={row.grantedModules[i]}>{v.title}</Tag>
                })
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 60,
            render: (text, row) => (
                <>
                    <Button size="small" className="mx-1" onClick={() => { formRef.current.openForm(text) }}>
                        <span className="d-flex">
                            <EditOutlined />
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
        admService.listAdminModules(data).then(res => {
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

    useEffect(() => {
        list();
        admService.listModules().then(res => { setModules(res.result.data || []) });
        console.log('config---', config);
    }, []);

    return (
        <>
            <div className="page-description text-white p-2" >
                <span>Customer List</span>
            </div>
            <div className="m-2 border p-2">
                <MyTable {...{ data, columns, parentSData: sdata, loading, formRef, list, searchPlaceholder: 'First Name or Last Name', addNew: false }} />
            </div>
            <AddForm ref={formRef} {...{ list, modules }} />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, modules } = props;
    const [ajxRequesting, setAjxRequesting] = useState(false)
    const [visible, setVisible] = useState(false)
    const [data, setData] = useState({});

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setData({ ...dt });
            handleVisible(true);
        }
    }));

    const handleChange = (v, k) => { setData({ ...data, [k]: v }); }

    const save = () => {
        setAjxRequesting(true);
        admService.saveAdminModules(data).then((res) => {
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
                title={'Add / Remove Modules'}
                style={{ top: 20 }}
                visible={visible}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { handleVisible(false); }}
                destroyOnClose
                maskClosable={false}
                width={1200}
                className="app-modal-body-overflow"
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <form onSubmit={e => { e.preventDefault(); save() }} autoComplete="off" spellCheck="false">
                        <fieldset>
                            <div className="row mingap">
                                <div>
                                    <div className="col-md-12 form-group">
                                        <div className="d-flex mb-2">
                                            <Button size="small" danger className="ml-auto mx-2" onClick={() => { handleChange([], 'grantedModules') }}> Uncheck All Modules</Button>
                                            <Button size="small" type="primary" onClick={() => { handleChange(modules?.map(v=>v?._id), 'grantedModules') }}> Check All Modules</Button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <MultiChechBox options={modules} value={data.grantedModules} onChange={v => { (!v?.length || handleChange(v, 'grantedModules')) }} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </Spin>
            </Modal>
        </>
    );
})