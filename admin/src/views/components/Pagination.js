import { Pagination, Tag } from 'antd';
import { If } from '../../utils/controls';

export default function MyPagination(props) {
    const { sdata, handleSData, setSData } = props;
    const handleChange = (page, pp) => {
        handleSData(page, 'page');
        if(sdata.limit !== pp){
            setSData({...sdata, page: 1, limit: pp});
        }
    }
    const showTotal = () =>{
        let start = (sdata.page - 1) * sdata.limit * 1 + 1;
        let end = sdata.page * sdata.limit;
        return <Tag color="magenta">{'Showing ' + start + ' - ' + end + ' out of ' + sdata.total}</Tag>
    }
    return (
        <If cond={sdata.total > 0}>
            <Pagination
                total={sdata.total}
                showTotal={showTotal}
                pageSize={sdata.limit}
                current={sdata.page}
                onChange={handleChange}
                showSizeChanger={true}
            />
        </If>
    )
};