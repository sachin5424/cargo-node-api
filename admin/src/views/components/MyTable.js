/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import MyPagination from './Pagination';
import { If } from '../../utils/controls';
// import { AntdSelect } from '../../utils/Antd';


export default function MyTable(props) {
    let { columns, data, parentSData, loading, formRef, list, filters, searchPlaceholder } = props;
    let [sdata, setSData] = useState({ ...parentSData });
    const handleSData = (v, k) => {
        if (k === 'key') {
            sdata.page = 1;
        }
        setSData({ ...sdata, [k]: v });
    }

    useEffect(() => {
        if (parentSData.total) {
            handleSData(parentSData.total, 'total')
        }
    }, [parentSData.total]);



    useEffect(() => {
        if (sdata.total) {
            list(sdata);
        }
    }, [sdata.page, sdata.limit]);

    data = data.map((v, i) => { return { index: i + 1, key: i, ...v } })
    columns = [{ title: '#', dataIndex: 'index', width: 40 }, ...columns]

    const state = {
        bordered: true,
        loading,
        size: 'small',
        title: () => <><Search {...{ sdata, handleSData, formRef, list, filters, searchPlaceholder }} /></>,
        showHeader: true,
        footer: () => <MyPagination {...{ sdata, handleSData, setSData }} />,
        scroll: undefined,
        hasData: true,
        tableLayout: undefined,
        yScroll: 'calc(100vh - 316px)'
    };

    const { xScroll, yScroll } = state;
    const scroll = {};
    if (yScroll) {
        scroll.y = yScroll;
    }
    if (xScroll) {
        scroll.x = xScroll;
    }
    const tableColumns = columns.map(item => ({ ...item }));
    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }

    return (
        <>
            <Table
                {...state}
                pagination={{ position: ['none'], pageSize: sdata.limit }}
                columns={tableColumns}
                dataSource={state.hasData ? data : null}
                scroll={scroll}
            />
        </>
    );
}


const Search = ({ sdata, handleSData, formRef, list, filters, searchPlaceholder }) => {
    return <>
        <div className="d-flex">
            <If cond={typeof sdata.key !== 'undefined'}>
                <Input className="w200 mx-1" allowClear placeholder={searchPlaceholder || "Search"} value={sdata.key || ''} onChange={(e) => { handleSData(e.target.value, 'key') }} />
                <Button type="primary" onClick={() => { list(sdata) }} >Search</Button>
            </If>
            {/* <If cond={typeof filters !== 'undefined'}>
                {filters.map((v, i) => (
                    <React.Fragment key={i}>
                        <If cond={v.type === 'dropdown'}>
                            <AntdSelect style={200} options={v.options} value={sdata?.[v.key] || ''} onChange={value => { handleSData(value, v.key) }} />
                        </If>
                    </React.Fragment>
                ))}
            </If> */}
            <Button type="primary" className="ml-auto">
                <span className="d-flex" onClick={() => { formRef.current.openForm() }}>
                    <PlusOutlined className="my-auto mx-1" />
                    Add New
                </span>
            </Button>
        </div>
    </>
}