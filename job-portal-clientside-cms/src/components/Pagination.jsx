import { Select } from "antd";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

const { Option } = Select;

const Pagination = ({
  current,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
  const startItem = total == 0 ? 0 : (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const paginationRange = () => {
    const rangeSize = 5;
    let start = Math.max(current - Math.floor(rangeSize / 2), 1);
    let end = Math.min(start + rangeSize - 1, totalPages);

    if (end - start + 1 < rangeSize) {
      start = Math.max(end - rangeSize + 1, 1);
    }

    const range = [];
    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push("...");
      }
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push("...");
      }
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span>Items per page:</span>
        <Select
          defaultValue={pageSize}
          style={{ width: 70 }}
          onChange={(value) => onPageSizeChange(1, value)}
          bordered={false}
        >
          <Option value={10}>10</Option>
          <Option value={25}>25</Option>
          <Option value={50}>50</Option>
          <Option value={100}>100</Option>
        </Select>
        <div className="vertical-divider"></div>
        <span className="text-gray-500">{`${startItem}-${endItem} of ${total} items`}</span>
      </div>

      <div className="flex items-center space-x-2">
        <div className="vertical-divider"></div>
        {paginationRange().map((pageNumber, index) =>
          typeof pageNumber === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(pageNumber, pageSize)}
              className={`px-2 py-1 rounded-md ${
                pageNumber === current ? "bg-red-600 text-white" : "text-black"
              }`}
            >
              {pageNumber < 10 ? `0${pageNumber}` : pageNumber}
            </button>
          ) : (
            <span key={index} className="mx-1 p-1 text-gray-500">
              {pageNumber}
            </span>
          )
        )}

        <div className="vertical-divider"></div>
        <button
          onClick={() => onPageChange(Math.max(1, current - 1), pageSize)}
          disabled={current === 1}
        >
          <ChevronLeftIcon
            className={`size-4 ${current === 1 ? "text-gray-400" : ""}`}
          />
        </button>

        <div className="vertical-divider"></div>
        <button
          onClick={() =>
            onPageChange(Math.min(totalPages, current + 1), pageSize)
          }
          disabled={current === totalPages}
        >
          <ChevronRightIcon
            className={`size-4 ${
              current === totalPages ? "text-gray-400" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
