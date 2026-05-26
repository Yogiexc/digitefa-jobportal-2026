import { Card, Typography, Divider, Checkbox } from "antd";

const { Title, Text } = Typography;

const AiTalentFilter = ({ filterCriteria, onFilterChange, showAppliedOnly, setShowAppliedOnly }) => {
    return (
        <Card
            className="rounded-2xl border-gray-100 shadow-sm sticky top-6"
            bodyStyle={{ padding: '24px' }}
        >
            <Title level={4} className="mb-4">Sort & Filter</Title>
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
                {/* Show Applied Only checkbox */}
                <div className="mt-4">
                    <Checkbox checked={showAppliedOnly} onChange={e => setShowAppliedOnly(e.target.checked)}>
                        Show Applied Only
                    </Checkbox>
                </div>
            </div>

            <Divider className="my-4" />

            <div>
                <Text className="font-bold text-black block mb-4">Application Status</Text>
                <Checkbox
                    checked={showAppliedOnly}
                    onChange={(e) => setShowAppliedOnly(e.target.checked)}
                >
                    Show Applied Only
                </Checkbox>
            </div>
        </Card>
    );
};

export default AiTalentFilter;
