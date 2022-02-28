import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Table, Button, Input, Modal, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import MyPagination from './Pagination';


export default function MyTable() {
    const formRef = useRef();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            render: () => (
                <>
                    <Button type="" size="small" className="mx-1" onClick={()=>{formRef.current.openForm()}}>
                        <span className="d-flex">
                            <EditOutlined />
                        </span>
                    </Button>
                    <Button type="danger" size="small">
                        <span className="d-flex">
                            <Popconfirm
                                title="Are you sure to delete this task?"
                                // onConfirm={confirm}
                                // onCancel={cancel}
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
    ];
    
    const data = [];
    for (let i = 1; i <= 20; i++) {
        data.push({
            key: i,
            name: 'John Brown',
            age: `${i}2`,
            address: `New York No. ${i} Lake Park`,
        });
    }
    const Search = () => <>
        <div className="d-flex">
            <Input className="w200 mx-1" placeholder="Search" />
            <Button type="primary" >Search</Button>
            <Button type="primary" className="ml-auto">
                <span className="d-flex" onClick={()=>{formRef.current.openForm()}}>
                    <PlusOutlined className="my-auto mx-1" />
                    Add New
                </span>
            </Button>
        </div>
    </>
    
    const state = {
        bordered: true,
        loading: false,
        size: 'small',
        title: () => <><Search /></>,
        showHeader: true,
        footer: () => <MyPagination />,
        scroll: undefined,
        hasData: true,
        tableLayout: undefined,
        yScroll: 'calc(100vh - 262px)'
    };

    const { xScroll, yScroll } = state;
    const scroll = {};
    if (yScroll) {
        scroll.y = yScroll;
    }
    if (xScroll) {
        scroll.x = xScroll;
    }
    const tableColumns = columns.map(item => ({ ...item, ellipsis: state.ellipsis }));
    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }

    return (
        <>
            <AddForm
                ref={formRef}
            />
            <Table
                {...state}
                pagination={{ position: ['none'] }}
                columns={tableColumns}
                dataSource={state.hasData ? data : null}
                scroll={scroll}
            />
        </>
    );
}

const AddForm = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const handleVisible = (val) => {
        setVisible(val);
    }

    useImperativeHandle(ref, () => ({
        openForm() {
            handleVisible(true);
        }
    }));

    let [data, setData]=useState({});
    const handleChange=(v, k)=>{
        setData();
    }

    const save=()=>{
    }

    return (
        <>
            {/* <Button type="primary" onClick={() => handleVisible(true)}>
                Display a modal dialog at 20px to Top
            </Button> */}
            <Modal
                title="20px to Top"
                style={{ top: 20 }}
                visible={visible}
                onOk={() => handleVisible(false)}
                onCancel={() => handleVisible(false)}
                width={800}
            >
                <form onSubmit={e=>{e.preventDefault(); save()}} autoComplete="off" spellCheck="false">
                <div className="">
                    <div className="row mingap">

                        <div className="col-md-6 form-group">
                            <label className="req">Item Name</label>
                            <Input value={data.name || ''} onChange={e=>handleChange(e.target.value, 'name')} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="req">Item Name</label>
                            <Input value={data.name || ''} onChange={e=>handleChange(e.target.value, 'name')} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="req">Item Name</label>
                            <Input value={data.name || ''} onChange={e=>handleChange(e.target.value, 'name')} />
                        </div>

                        <div className="col-md-12 form-group">
                            <label className="req">Description</label>
                            <Input.TextArea rows="4" value={data.description || ''} onChange={e=>handleChange(e.target.value, 'description')} />
                        </div>

                    </div>
                </div>

            </form>
        
            </Modal>
        </>
    );
})