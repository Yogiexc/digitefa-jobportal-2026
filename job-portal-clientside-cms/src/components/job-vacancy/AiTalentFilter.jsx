import { Card, Typography, Divider, Checkbox } from "antd";

const { Title, Text } = Typography;

const AiTalentFilter = ({ filterCriteria, onFilterChange, applicationSource, setApplicationSource }) => {
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
                        { value: "summary", label: "By Personal Summary" }, // Tambahan Baru
                        { value: "certification", label: "By Certification" }, // Tambahan Baru
                    ]}
                    value={filterCriteria}
                    onChange={onFilterChange}
                />
            </div>

            <Divider className="my-4" />

            <div>
                <Text className="font-bold text-black block mb-4">Application Source</Text>
                <Checkbox.Group 
                    value={applicationSource} 
                    onChange={setApplicationSource}
                    className="flex flex-col gap-2"
                    options={[
                        { value: "manual", label: "Manual Application" },
                        { value: "invited", label: "Invited Candidate" }
                    ]}
                />
            </div>
        </Card>
    );
};

export default AiTalentFilter;