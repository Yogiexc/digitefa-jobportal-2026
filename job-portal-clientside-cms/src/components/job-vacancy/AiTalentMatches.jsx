import { Button, Layout, Modal, Table, message, Progress, Space, Typography, Tag, Avatar, Tooltip, Drawer, Divider } from "antd";
import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { SparklesIcon, UserCircleIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

const { Content } = Layout;
const { Text, Title } = Typography;

const AiTalentMatches = ({ open, setOpen, onBack, jobId, jobDescription, onViewProfile }) => {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [invitingId, setInvitingId] = useState(null);
    const [openProfile, setOpenProfile] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        if (open && jobId) {
            if (jobDescription) {
                fetchAiMatches(jobDescription);
            } else {
                // Fallback: Fetch job detail first if description is not passed directly
                fetchJobDetailAndMatches();
            }
        }
    }, [open, jobId, jobDescription]);

    const fetchJobDetailAndMatches = async () => {
        setLoading(true);
        try {
            const { data } = await Api.get(`/jobs/${jobId}`);
            if (data && data.description) {
                await fetchAiMatches(data.description);
            } else {
                message.warning("Job description is empty. Cannot perform AI matching.");
                setLoading(false);
            }
        } catch (error) {
            message.error("Failed to fetch job details.");
            setLoading(false);
        }
    };

    const fetchAiMatches = async (desc) => {
        setLoading(true);
        try {
            // Endpoint added to job-portal backend that interacts with python similarity model
            const { data } = await Api.get(`/companies/search/ai-talents?job_description=${encodeURIComponent(desc)}`);

            // Sort matches by AI score descending
            const sortedMatches = (data || []).sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
            setMatches(sortedMatches);
        } catch (error) {
            message.error("Failed to generate AI recommendations.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 0.7) return "#52c41a"; // Green for highly relevant
        if (score >= 0.4) return "#faad14"; // Yellow for moderately relevant
        return "#f5222d"; // Red for less relevant
    };

    const getScoreText = (score) => {
        if (score >= 0.7) return "High Match";
        if (score >= 0.4) return "Medium Match";
        return "Low Match";
    };

    const handleInvite = async (candidate) => {
        const jobSeekerId =
            candidate.job_seeker_id ||
            candidate.job_seeker?.job_seeker_id ||
            candidate.student_id;
        if (!jobSeekerId) {
            message.error("Candidate ID not found.");
            return;
        }

        setInvitingId(jobSeekerId);
        try {
            await Api.post(`/jobs/${jobId}/invite`, { job_seeker_id: jobSeekerId });
            message.success(`Invitation successfully sent to ${candidate.job_seeker?.full_name || "candidate"}!`);
        } catch (error) {
            const msg =
                error?.data?.message ||
                error?.response?.data?.message ||
                "Failed to send invitation. They might already be invited.";
            message.error(msg);
        } finally {
            setInvitingId(null);
        }
    };

    const columns = [
        {
            title: "Applicant Profile",
            key: "profile",
            width: "18%",
            render: (_, record) => (
                <Space align="center" style={{ minWidth: 150 }}>
                    <Avatar
                        size={48}
                        src={record.photo_profile ? record.photo_profile : null}
                        icon={!record.photo_profile && <UserCircleIcon />}
                    />
                    <div className="flex flex-col" style={{ overflow: 'hidden' }}>
                        <Text strong className="text-sm">
                            {record.job_seeker?.full_name || "Unknown Candidate"}
                        </Text>
                        <Text type="secondary" className="text-xs" style={{ fontSize: '10px' }}>
                            {record.job_seeker?.email}
                        </Text>
                    </div>
                </Space>
            )
        },
        {
            title: "Qualifications",
            key: "qualifications",
            width: "40%",
            render: (_, record) => {
                const formatEducation = (text) => {
                    if (!text) return "";
                    const words = text.split(' ');
                    let result = "";
                    for (let i = 0; i < words.length; i++) {
                        result += words[i];
                        if ((i + 1) % 2 === 0 && i !== words.length - 1) {
                            result += "\n";
                        } else {
                            result += " ";
                        }
                    }
                    return result.trim();
                };

                const educationText = record.education 
                    ? `${record.education.degree} in ${record.education.major}`
                    : null;

                return (
                    <div className="flex flex-col gap-3">
                        {/* Education Section */}
                        {educationText && (
                            <div>
                                <Text style={{ fontSize: '10px', color: '#8c8c8c' }} bold uppercase>Education</Text>
                                <div className="mt-1">
                                    <Tag color="blue" className="rounded-md px-2 py-1 border-blue-200 m-0 w-fit h-auto whitespace-pre-line leading-relaxed text-xs">
                                        {formatEducation(educationText)}
                                    </Tag>
                                </div>
                            </div>
                        )}

                        {/* Experience Section */}
                        {record.experiences?.length > 0 && (
                            <div>
                                <Text style={{ fontSize: '10px', color: '#8c8c8c' }} bold uppercase>Experience</Text>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(record.experiences || []).slice(0, 3).map((exp, idx) => (
                                        <Tag color="purple" key={exp.experience_id || idx} className="rounded-md px-2 py-0.5 border-purple-200 text-xs">
                                            {exp.experience_title}
                                        </Tag>
                                    ))}
                                    {record.experiences?.length > 3 && <Tag className="rounded-md text-xs">+{record.experiences.length - 3} more</Tag>}
                                </div>
                            </div>
                        )}

                        {/* Skills Section */}
                        {record.skills?.length > 0 && (
                            <div>
                                <Text style={{ fontSize: '10px', color: '#8c8c8c' }} bold uppercase>Skills</Text>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(record.skills || []).slice(0, 6).map(skill => (
                                        <Tag color="cyan" key={skill.job_seeker_skill_id} className="rounded-md px-2 py-0.5 border-cyan-200 text-xs">
                                            {skill.skill_name}
                                        </Tag>
                                    ))}
                                    {record.skills?.length > 6 && <Tag className="rounded-md text-xs">+{record.skills.length - 6} more</Tag>}
                                </div>
                            </div>
                        )}

                        {/* Languages Section */}
                        {record.languages?.length > 0 && (
                            <div>
                                <Text style={{ fontSize: '10px', color: '#8c8c8c' }} bold uppercase>Languages</Text>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {(record.languages || []).map((lang, idx) => (
                                        <Tag color="orange" key={lang.language_id || idx} className="rounded-md px-2 py-0.5 border-orange-200 text-xs">
                                            {lang.language_name}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: "AI Similarity Score",
            key: "score",
            width: "17%",
            render: (_, record) => {
                const score = record.ai_score || 0;
                const color = getScoreColor(score);
                return (
                    <div className="flex flex-col" style={{ minWidth: 140 }}>
                        <Space justify="space-between" className="w-full mb-1">
                            <Text strong style={{ color, fontSize: '11px' }}>{getScoreText(score)}</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>{(score * 100).toFixed(0)}%</Text>
                        </Space>
                        <Progress
                            percent={Math.round(score * 100)}
                            showInfo={false}
                            strokeColor={color}
                            trailColor="#f5f5f5"
                            size="small"
                        />
                    </div>
                )
            }
        },
        {
            title: "Action",
            key: "action",
            width: "10%",
            render: (_, record) => (
                <Space direction="vertical" size="small" className="w-full">
                    <Button
                        type="primary"
                        icon={<EnvelopeIcon className="h-4 w-4 mr-1 text-white border-white inline" />}
                        className="bg-purple-600 hover:bg-purple-500 w-full text-xs"
                        onClick={() => handleInvite(record)}
                        loading={invitingId === (record.job_seeker?.job_seeker_id || record.job_seeker_id || record.student_id)}
                    >
                        Invite
                    </Button>
                    
                    {onViewProfile && (
                        <Button
                            type="link"
                            size="small"
                            className="w-full text-xs text-purple-600"
                            onClick={() => onViewProfile(record.job_seeker_id)}
                        >
                            Full Profile
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <Content className="p-6">
            <div className="flex items-center mb-6 border-b pb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <SparklesIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                    <Title level={3} style={{ marginBottom: 0 }}>AI Talent Matches</Title>
                    <Text type="secondary">
                        Deep Learning MiniLM analysis of all available talents compared against this specific job's requirements.
                    </Text>
                </div>
            </div>

            <Table
                className="custom-table"
                columns={columns}
                dataSource={matches}
                rowKey="job_seeker_detail_id"
                loading={loading}
                pagination={{ pageSize: 15 }}
                locale={{
                    emptyText: loading
                        ? "AI is analyzing thousands of candidate profiles..."
                        : "No suitable talents found for this job description."
                }}
            />

            <div className="flex justify-end mt-6">
                <Button onClick={onBack} size="large">
                    Back to Vacancies
                </Button>
            </div>

            <Drawer
                title="Candidate Profile Details"
                placement="right"
                width={500}
                onClose={() => setOpenProfile(false)}
                open={openProfile}
            >
                {selectedCandidate && (
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4 mb-6">
                            <Avatar size={64} src={selectedCandidate.photo_profile || selectedCandidate.job_seeker?.profile_picture_url} icon={!(selectedCandidate.photo_profile || selectedCandidate.job_seeker?.profile_picture_url) && <UserCircleIcon className="h-full w-full" />} />
                            <div>
                                <Title level={4} style={{ marginBottom: 0 }}>{selectedCandidate.job_seeker?.full_name || "Unknown Candidate"}</Title>
                                <Text type="secondary">{selectedCandidate.job_seeker?.email || "No Email Provided"}</Text>
                            </div>
                        </div>

                        {selectedCandidate.personal_summary && (
                            <div className="mb-6">
                                <Title level={5}>Summary</Title>
                                <Text>{selectedCandidate.personal_summary}</Text>
                            </div>
                        )}

                        <div className="mb-6">
                            <Title level={5}>Skills Match</Title>
                            <div className="flex flex-wrap gap-2">
                                {(selectedCandidate.skills || []).map((skill, index) => (
                                    <Tag color="cyan" key={skill.job_seeker_skill_id || index}>{skill.skill_name || skill}</Tag>
                                ))}
                            </div>
                        </div>

                        {selectedCandidate.languages && selectedCandidate.languages.length > 0 && (
                            <div className="mb-6">
                                <Title level={5}>Languages</Title>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.languages.map((lang, index) => (
                                        <Tag color="orange" key={lang.language_id || index}>{lang.language_name}</Tag>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedCandidate.education && (
                            <div className="mb-6">
                                <Title level={5}>Education</Title>
                                <div className="mb-2">
                                    <Text strong>{selectedCandidate.education.university_name}</Text><br />
                                    <Text type="secondary">{selectedCandidate.education.degree} in {selectedCandidate.education.major}</Text>
                                </div>
                            </div>
                        )}

                        {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 && (
                            <div className="mb-6">
                                <Title level={5}>Experience</Title>
                                {selectedCandidate.experiences.map((exp, index) => (
                                    <div key={exp.experience_id || index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                                        <Text strong>{exp.experience_title}</Text><br />
                                        <Text>{exp.company_name}</Text> <br />
                                        {exp.description && <Text type="secondary" className="text-sm line-clamp-3">{exp.description}</Text>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </Content>
    );
};

export default AiTalentMatches;
