import { Pagination, Tag, Button } from 'antd';
import { CSVLink } from "react-csv";

export default function MyPagination(props) {
    const { sdata, handleSData, setSData, csvData } = props;
    const handleChange = (page, pp) => {
        handleSData(page, 'page');
        if (sdata.limit !== pp) {
            setSData({ ...sdata, page: 1, limit: pp });
        }
    }
    const showTotal = () => {
        let start = (sdata.page - 1) * sdata.limit * 1 + 1;
        let end = sdata.page * sdata.limit;
        return <Tag color="magenta">{'Showing ' + start + ' - ' + end + ' out of ' + sdata.total}</Tag>
    }
    return (
        <>
            {
                sdata.total > 0
                    ? <Pagination
                        total={sdata.total}
                        showTotal={showTotal}
                        pageSize={sdata.limit}
                        current={sdata.page}
                        onChange={handleChange}
                        showSizeChanger={true}
                    />
                    : null
            }
            {
                Array.isArray(csvData) && csvData?.length
                    ? <Button className="mx-1" size="small" type="link">
                        <CSVLink data={csvData}>Export To CSV</CSVLink>
                    </Button>
                    : null
            }

        </>

    )
};