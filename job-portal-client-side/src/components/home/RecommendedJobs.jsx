import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, message, Spin } from "antd";
import {
    BriefcaseIcon,
    BookmarkIcon,
    CurrencyDollarIcon,
    CursorArrowRippleIcon,
    WifiIcon,
    MapPinIcon,
    PresentationChartBarIcon,
    ClockIcon,
    ComputerDesktopIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";

const getEmploymentTypeIcon = (employmentType) => {
    switch (employmentType) {
        case "Full Time":
            return <BriefcaseIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        case "Freelance":
            return <ComputerDesktopIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        case "Internship":
            return <ClockIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        default:
            return null;
    }
};

const getWorkTypeIcon = (workType) => {
    switch (workType) {
        case "Remote":
            return <WifiIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        case "Hybrid":
            return <CursorArrowRippleIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        case "On Site":
            return <MapPinIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
        default:
            return null;
    }
};

const calculateDaysAgo = (published_at) => {
    const publishedDate = new Date(published_at);
    const currentDate = new Date();
    const differenceInTime = currentDate - publishedDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
};

const RecommendedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_IMAGE_API;

    const userData = JSON.parse(localStorage.getItem("userData"));

    // Only render if a job seeker is logged in
    if (!userData || userData.role !== "job_seeker") return null;

    useEffect(() => {
        setLoading(true);
        Api.get("/jobs-search?pageSize=6&sortBy=most_relevant")
            .then((response) => {
                setJobs(response.data?.data || response.data || []);
            })
            .catch((error) => {
                console.error("Error fetching recommended jobs:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleBookmarkClick = (index, job_id, is_saved) => {
        if (!is_saved) {
            Api.post(`/jobs/${job_id}/save`)
                .then(() => {
                    message.destroy();
                    message.success("Job saved successfully");
                    setJobs(prev => prev.map(j => j.job_id === job_id ? { ...j, is_saved: true } : j));
                });
        } else {
            Api.post(`/jobs/${job_id}/unsave`)
                .then(() => {
                    message.destroy();
                    message.success("Job removed from saved list");
                    setJobs(prev => prev.map(j => j.job_id === job_id ? { ...j, is_saved: false } : j));
                });
        }
    };

    const handleApplyJob = (job_id) => {
        navigate(`/jobs/${job_id}/apply`);
    };

    if (loading || !jobs || jobs.length === 0) return null; // Or a smaller loading state

    return (
        <div className="py-12 px-2 md:px-16 bg-[#FAFAFA]">
            <div className="container mx-auto">
                <div className="text-center mb-8 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 rounded-full mb-3 shadow-[0_4px_10px_rgba(0,167,59,0.1)] border border-[#c2f0d1]">
                        <SparklesIcon className="w-5 h-5 text-[#06A73B]" />
                        <span className="text-sm font-semibold text-[#06A73B]">DIREKOMENDASIKAN UNTUK ANDA</span>
                    </div>
                    <h2 className="text-2xl md:text-[36px] font-semibold text-gray-800">
                        Cepat Dapatkan Pekerjaan Terkait
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm max-w-lg">Berdasarkan profil Anda (kesesuaian kata/kalimat menggunakan AI), kami menemukan beberapa lowongan yang mungkin cocok.</p>
                </div>
                <Row gutter={[16, 16]} justify="center">
                    {jobs.map((job, index) => (
                        <Col key={job.job_id} xs={24} sm={12} md={8}>
                            <Card className="relative rounded-2xl border-2 border-green-100 hover:border-green-300 transition-colors shadow-sm cursor-pointer" onClick={() => navigate(`/jobs/${job.job_id}`)}>
                                {job.similarity_score && job.similarity_score > 0 && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex flex-row items-center gap-1">
                                        <span>{(job.similarity_score * 100).toFixed(0)}% AI Match</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start pt-2">
                                    <div className="flex gap-4">
                                        <img
                                            src={`${API_URL}/${job.company.logo_url}`}
                                            alt="Job Icon"
                                            className="w-14 h-14 object-contain rounded-lg border p-1 border-gray-100"
                                        />
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-[16px] font-semibold text-gray-900 leading-tight truncate-multiline">{job.title}</h3>
                                            <p className="text-[13px] text-gray-600 mt-1">
                                                {job.company.legal_name}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="text"
                                        shape="circle"
                                        style={{ backgroundColor: job.is_saved ? "#06A73B" : "#F3F4F6", width: 36, height: 36 }}
                                        onClick={(e) => { e.stopPropagation(); handleBookmarkClick(index, job.job_id, job.is_saved); }}
                                    >
                                        <BookmarkIcon className="size-4" style={{ color: job.is_saved ? "white" : "#6B7280" }} />
                                    </Button>
                                </div>

                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <div className="bg-[#E3FCEC] text-[#2E7D32] text-[11px] font-medium rounded-full px-3 py-1 flex items-center">
                                            {getEmploymentTypeIcon(job.employment_type)}
                                            {job.employment_type}
                                        </div>
                                        <div className="bg-[#E3FCEC] text-[#2E7D32] text-[11px] font-medium rounded-full px-3 py-1 flex items-center">
                                            {getWorkTypeIcon(job.work_type)}
                                            {job.work_type}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-400 font-medium">
                                            {calculateDaysAgo(job.published_at) === 0 ? "Posted today" : `${calculateDaysAgo(job.published_at)}d ago`}
                                        </span>
                                        <Button
                                            style={{ borderRadius: '8px', height: 36, backgroundColor: "#06A73B", color: "white", padding: '0 20px' }}
                                            onClick={(e) => { e.stopPropagation(); handleApplyJob(job.job_id); }}
                                        >
                                            <span className="text-xs font-semibold">Apply</span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div>
    );
};

export default RecommendedJobs;
