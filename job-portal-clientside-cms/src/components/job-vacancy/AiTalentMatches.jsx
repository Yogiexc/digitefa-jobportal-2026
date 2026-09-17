import { Button, Layout, Typography, Row, Col, Card, Spin, App } from "antd";
import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { SparklesIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import JobFallback from "../../assets/images/broken.jpg";
import AiTalentFilter from "./AiTalentFilter";
import Pagination from "../Pagination";

const API_URL = import.meta.env.VITE_IMAGE_API;

const { Content } = Layout;
const { Text, Title } = Typography;

const AiTalentMatches = ({ open, setOpen, onBack, jobId, jobDescription, onViewProfile }) => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [invitingId, setInvitingId] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState(["skills", "projects", "experience", "education", "summary", "certification"]);
    const [applicationSource, setApplicationSource] = useState([]);
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (open && jobId) {
            if (jobDescription) {
                fetchAiMatches(jobDescription);
            } else {
                // Fallback: Fetch job detail first if description is not passed directly
                fetchJobDetailAndMatches();
            }
        }
    }, [open, jobId, jobDescription, filterCriteria]);

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
            // Passing jobId to check for existing invitations
            // Passing filterCriteria to the backend
            const criteriaParam = filterCriteria.length > 0 ? `&criteria=${filterCriteria.join(',')}` : '';
            const { data } = await Api.get(`/companies/search/ai-talents?job_description=${encodeURIComponent(desc)}&job_id=${jobId}${criteriaParam}`, { timeout: 60000 });

            // Sort matches by AI score descending
            const sortedMatches = (data || []).sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
            setMatches(sortedMatches);
            setPage(1); // Reset page on new fetch
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

            // Update local state to reflect that this candidate is now invited
            setMatches(prev => prev.map(m => {
                const mId = m.job_seeker_id || m.job_seeker?.job_seeker_id;
                if (mId === jobSeekerId) {
                    return { ...m, is_invited: true };
                }
                return m;
            }));
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

    const handleFilterChange = (checkedValues) => {
        if (checkedValues.length === 0) {
            message.warning("Select at least one recommendation criteria");
            return;
        }
        setFilterCriteria(checkedValues);
        setPage(1); // Reset page on filter change
    };

    const handlePageChange = (newPage, newSize) => {
        setPage(newPage);
        setPageSize(newSize);
    };


    const filteredMatches = applicationSource.length > 0 
        ? matches.filter(m => applicationSource.includes(m.candidate_source)) 
        : matches;

    const startIndex = (page - 1) * pageSize;
    const displayedMatches = filteredMatches.slice(startIndex, startIndex + pageSize);

    return (
        <Content className="p-6">
            <div className="flex items-center mb-6 border-b pb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                    <SparklesIcon className="h-8 w-8 text-red-600" />
                </div>
                <div>
                    <Title level={3} style={{ marginBottom: 0 }}>AI Talent Matches</Title>
                    <Text type="secondary">
                        Deep Learning MiniLM analysis of all available talents compared against this specific job's requirements.
                    </Text>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filter */}
                <div className="w-full lg:w-1/4">
                    <AiTalentFilter
                        filterCriteria={filterCriteria}
                        onFilterChange={handleFilterChange}
                        applicationSource={applicationSource}
                        setApplicationSource={setApplicationSource}
                    />
                </div>

                {/* Talent List */}
                <div className="w-full lg:w-3/4">
                    {loading ? (
                        <div className="flex justify-center items-center py-40 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Spin size="large" />
                        </div>
                        ) : filteredMatches.length > 0 ? (
                        <>
                            <Row gutter={[20, 20]}>
                                {displayedMatches.map((record, index) => {
                                    const score = record.ai_score || 0;
                                    const jobSeekerId = record.job_seeker_id || record.job_seeker?.job_seeker_id;
                                    const education = record.education?.[0];

                                    return (
                                        <Col key={record.job_seeker_detail_id || index} xs={24} md={12}>
                                            <Card
                                                className="relative h-full rounded-2xl border-2 border-red-50 hover:border-red-200 transition-all duration-300 shadow-sm"
                                                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}
                                            >
                                                <div>
                                                {score > 0 && (
                                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex flex-row items-center gap-1 z-10">
                                                        <SparklesIcon className="size-3" />
                                                        <span>{(score * 100).toFixed(0)}% AI Match</span>
                                                    </div>
                                                )}
                                                {record.is_invited && record.is_applied && (
                                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl rounded-tl-2xl z-10 shadow-sm">
                                                        Applied from Invitation
                                                    </div>
                                                )}

                                                <div className="flex-1">
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
                                                        <div className="flex flex-wrap gap-2 mt-2 min-h-[58px] max-h-[58px] overflow-hidden content-start">
                                                            {record.skills?.map((skill, sIdx) => (
                                                                <div key={sIdx} className="bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-full px-3 py-1 border border-blue-100 flex items-center">
                                                                    {skill.skill_name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100 gap-2">
                                                    
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">University</span>
                                                        <span className="text-[11px] text-gray-600 font-medium truncate max-w-[100px] xl:max-w-[150px]">
                                                            {education?.university_name || "-"}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            className="rounded-xl h-9 px-4 text-[11px] font-bold text-gray-700 hover:text-red-600 hover:border-red-600 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onViewProfile) {
                                                                    onViewProfile(jobSeekerId);
                                                                }
                                                            }}
                                                        >
                                                            View Profile
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            className={`border-none rounded-xl h-9 px-4 flex items-center gap-2 ${
                                                                record.is_applied
                                                                    ? 'bg-blue-600 hover:bg-green-600 text-white cursor-not-allowed'
                                                                    : record.is_invited
                                                                    ? 'bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed'
                                                                    : 'bg-[#dd2a2a] hover:bg-[#FF9D98] text-white'
                                                            }`}
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                if (!record.is_invited && !record.is_applied) {
                                                                    handleInvite(record); 
                                                                }
                                                            }}
                                                            loading={invitingId === (record.job_seeker?.job_seeker_id || record.job_seeker_id || record.student_id)}
                                                        >
                                                            <span className="text-[11px] font-bold">
                                                                {record.is_applied ? "Applied" : record.is_invited ? "Invited" : "Invite"}
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                        <div className="mt-8">
                            <Pagination
                                current={page}
                                pageSize={pageSize}
                                total={filteredMatches.length}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageChange}
                            />
                        </div>
                        </>
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <UserCircleIcon className="size-12 text-gray-300 mx-auto mb-4" />
                            <Text type="secondary" className="text-gray-500 font-medium">
                                {applicationSource.length > 0 
                                    ? "No talents found matching the selected application source." 
                                    : "No suitable talents found for this job description."}
                            </Text>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={onBack} size="large">
                    Back to Vacancies
                </Button>
            </div>
        </Content>
    );
};

export default AiTalentMatches;
