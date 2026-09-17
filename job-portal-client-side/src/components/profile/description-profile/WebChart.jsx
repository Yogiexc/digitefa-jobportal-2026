import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from 'recharts';

const WebChart = ({ sectionItems }) => {
    if (!sectionItems) return null;

    // Normalization logic: Calculate score out of 100 max per section.
    const getScore = (list, type, maxScoreCriteria = 3) => {
        if (!list) return 0;
        if (type === 'text') return list ? 100 : 0;
        const count = list.length;
        return Math.min(100, Math.round((count / maxScoreCriteria) * 100));
    };

    const data = [
        {
            subject: 'Skills',
            A: getScore(sectionItems.skill?.list, 'array', 10),
            fullMark: 100,
        },
        {
            subject: 'Experience',
            A: getScore(sectionItems.experience?.list, 'array', 3),
            fullMark: 100,
        },
        {
            subject: 'Education',
            A: getScore(sectionItems.education?.list, 'array', 2),
            fullMark: 100,
        },
        {
            subject: 'Projects',
            A: getScore(sectionItems.project?.list, 'array', 3),
            fullMark: 100,
        },
        {
            subject: 'Languages',
            A: getScore(sectionItems.language?.list, 'array', 2),
            fullMark: 100,
        },
        {
            subject: 'Certs.',
            A: getScore(sectionItems.certification?.list, 'array', 2),
            fullMark: 100,
        },
    ];

    return (
        <div className="mt-8 flex flex-col items-center">
            <h3 className="text-sm font-semibold mb-2">Profile Strength</h3>
            <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Profile"
                            dataKey="A"
                            stroke="#06A73B"
                            fill="#06A73B"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WebChart;
