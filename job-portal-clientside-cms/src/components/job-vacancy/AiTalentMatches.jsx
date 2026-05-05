import { Button, Layout, Modal, Table, message, Progress, Space, Typography, Tag, Avatar, Tooltip, Drawer, Divider, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { SparklesIcon, UserCircleIcon, EnvelopeIcon, BookmarkIcon } from "@heroicons/react/24/solid";
import JobFallback from "../../assets/images/broken.jpg";

const API_URL = import.meta.env.VITE_IMAGE_API;

const { Content } = Layout;
const { Text, Title } = Typography;

const AiTalentMatches = ({ open, setOpen, onBack, jobId, jobDescription, onViewProfile }) => {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [invitingId, setInvitingId] = useState(null);

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

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Progress type="circle" percent={100} status="active" strokeColor={{ '0%': '#9333ea', '100%': '#a855f7' }} />
                    <Text className="mt-4 font-medium text-gray-500">AI is analyzing thousands of candidate profiles...</Text>
                </div>
            ) : matches.length > 0 ? (
                <Row gutter={[20, 20]}>
                    {matches.map((record, index) => {
                        const score = record.ai_score || 0;
                        const jobSeekerId = record.job_seeker_id || record.job_seeker?.job_seeker_id;
                        const education = record.education?.[0];
                        
                        return (
                            <Col key={record.job_seeker_detail_id || index} xs={24} sm={12} lg={8}>
                                <Card 
                                    className="relative rounded-2xl border-2 border-purple-50 hover:border-purple-200 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md" 
                                    onClick={() => onViewProfile && onViewProfile(jobSeekerId)}
                                    bodyStyle={{ padding: '20px' }}
                                >
                                    {score > 0 && (
                                        <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex flex-row items-center gap-1 z-10">
                                            <SparklesIcon className="size-3" />
                                            <span>{(score * 100).toFixed(0)}% AI Match</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-start pt-2">
                                        <div className="flex gap-4">
                                            <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 relative bottom-0">
                                                <img
                                                    src={record.photo_profile ? (record.photo_profile.startsWith('http') ? record.photo_profile : `${API_URL}/${record.photo_profile}`) : JobFallback}
                                                    alt="Candidate"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
                                                    className="w-full h-full object-cover "
                                                />
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <h3 className="text-[16px] font-bold text-gray-900 leading-tight truncate">
                                                    {record.job_seeker?.full_name || "Unknown Candidate"}
                                                </h3>
                                                <p className="text-[12px] text-gray-500 mt-1 truncate">
                                                    {record.job_seeker?.email || "No email provided"}
                                                </p>
                                                <p className="text-[12px] text-gray-500 mt-1 truncate">
                                                    {education?.degree || "No email provided"}
                                                </p>
                                            </div>
                                        </div>
                                       
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2 mt-2 max-h-[58px] overflow-hidden content-start">
                                            {record.skills?.map((skill, sIdx) => (
                                                <div key={sIdx} className="bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full px-3 py-1 border border-blue-100 flex items-center">
                                                    {skill.skill_name}
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">University</span>
                                                <span className="text-[11px] text-gray-600 font-medium truncate max-w-[150px]">
                                                    {education?.university_name || "-"}
                                                </span>
                                            </div>
                                            <Button
                                                type="primary"
                                                className="bg-purple-600 hover:bg-purple-700 border-none rounded-lg h-9 px-5 flex items-center gap-2"
                                                onClick={(e) => { e.stopPropagation(); handleInvite(record); }}
                                                loading={invitingId === (record.job_seeker?.job_seeker_id || record.job_seeker_id || record.student_id)}
                                            >
                                                <span className="text-xs font-bold">Invite</span>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <UserCircleIcon className="size-12 text-gray-300 mx-auto mb-4" />
                    <Text type="secondary" className="text-gray-500 font-medium">No suitable talents found for this job description.</Text>
                </div>
            )}

            <div className="flex justify-end mt-6">
                <Button onClick={onBack} size="large">
                    Back to Vacancies
                </Button>
            </div>
        </Content>
    );
};

export default AiTalentMatches;
