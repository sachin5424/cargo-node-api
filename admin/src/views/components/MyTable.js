/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import MyPagination from './Pagination';
import { AntdSelect, AntdDatepicker } from '../../utils/Antd';


export default function MyTable(props) {
    let { columns, data, parentSData, loading, formRef, list, filters, searchPlaceholder, addNew = true, addNewIcon = PlusOutlined, addNewText = 'Add New', csvData = [], allowSearch, allowDefaultSearch } = props;
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

    data = data?.map((v, i) => { return { index: i + 1, key: i, ...v } })
    columns = [{ title: 'S/N', dataIndex: 'index', width: 45 }, ...columns]

    const state = {
        bordered: true,
        loading,
        size: 'small',
        title: () => <><Search {...{ sdata, handleSData, formRef, list, filters, searchPlaceholder, addNew, addNewIcon, addNewText, allowSearch, allowDefaultSearch }} /></>,
        showHeader: true,
        footer: () => <MyPagination {...{ sdata, handleSData, setSData, csvData }} />,
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


const Search = ({ sdata, handleSData, formRef, list, filters, searchPlaceholder, addNew, addNewIcon: AddNewIcon, addNewText, allowSearch = true, allowDefaultSearch = true }) => {
    return <>
        {
            allowSearch
                ? <div className="d-flex">
                    {
                        typeof sdata.key !== 'undefined'
                            ? <>
                                {
                                    allowDefaultSearch
                                        ? <Input className="w200 mx-1" allowClear placeholder={searchPlaceholder || "Search"} value={sdata.key || ''} onChange={(e) => { handleSData(e.target.value, 'key') }} />
                                        : null
                                }
                                {
                                    typeof filters !== 'undefined'
                                        ? filters.map((v, i) => (
                                            <React.Fragment key={i}>
                                                {
                                                    v.type === 'dropdown'
                                                        ? <AntdSelect style={v.style} placeholder={v.placeholder || 'Select'} className={v?.className} allowClear={true} options={v.options} value={sdata?.[v.key] || undefined} onChange={value => { handleSData(value, v.key) }} />
                                                        : v.type === 'dropdownMultiple'
                                                            ? <AntdSelect mode="multiple" style={v.style} placeholder={v.placeholder || 'Select'} className={v?.className} allowClear={true} options={v.options} value={sdata?.[v.key] || undefined} onChange={value => { handleSData(value, v.key) }} />
                                                            : v.type === 'datePicker'
                                                                ? <AntdDatepicker format="MMMM D, YYYY" className={v?.className} style={v.style} placeholder={v.placeholder || 'Choose Date'}
                                                                    value={sdata?.[v.key]}
                                                                    onChange={value => { 
                                                                        console.log(value, v.key);
                                                                        handleSData(value, v.key);
                                                                     }} />
                                                                : null
                                                }
                                            </React.Fragment>
                                        ))
                                        : null
                                }
                                <Button type="primary" onClick={() => { list(sdata) }} >Search</Button>
                            </>
                            : null
                    }
                    {
                        addNew
                            ? <Button type="primary" className="ml-auto">
                                <span className="d-flex" onClick={() => { formRef.current.openForm() }}>
                                    {<AddNewIcon className="my-auto mx-1" />}
                                    {addNewText}
                                </span>
                            </Button>
                            : null
                    }

                </div>
                : null
        }

    </>
}