import { Card, Typography, Divider, Checkbox } from "antd";

const { Title, Text } = Typography;

const AiTalentFilter = ({ filterCriteria, onFilterChange }) => {
    return (
        <Card
            className="rounded-2xl border-gray-100 shadow-sm sticky top-6"
            bodyStyle={{ padding: '24px' }}
        >
            <Title level={4} className="mb-4">Sort By</Title>
            <Divider className="my-4" />

            <div>
                <Text className="font-bold text-black block mb-4">Most Relevant</Text>
                <Checkbox.Group
                    className="flex flex-col gap-4"
                    options={[
                        { value: "skills", label: "By Skills" },
                        { value: "projects", label: "By Projects" },
                        { value: "experience", label: "By Experience" },
                        { value: "education", label: "By Education" },
                    ]}
                    value={filterCriteria}
                    onChange={onFilterChange}
                />
            </div>
        </Card>
    );
};

export default AiTalentFilter;
