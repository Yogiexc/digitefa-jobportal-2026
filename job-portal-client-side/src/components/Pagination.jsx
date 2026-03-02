
import { Pagination } from 'antd';


const PaginationComponent = ({ current, total, pageSize, onChange }) => {
  return (
    <div className="flex justify-center mt-4 mb-4">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false} // Hides the option to change page size
      />
    </div>
  );
};

export default PaginationComponent;
