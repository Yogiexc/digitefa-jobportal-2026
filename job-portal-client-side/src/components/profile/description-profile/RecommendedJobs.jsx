import React from 'react';
import { Card, List, Button, Typography } from 'antd';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { dateToMonthYear } from '../../../utils'; // Pastikan path util ini benar

const { Title } = Typography;

const RecommendedJobs = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <Card className="jobportal-section my-1 w-full">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="size-6 text-gray-500" />
          <Title level={5} className="text-gray-700 !mb-0">Recommended Jobs</Title>
        </div>
        <p className="text-gray-500 text-sm mt-2">No recommended jobs available at the moment.</p>
      </Card>
    );
  }

  // Render hanya beberapa item rekomendasi saja, misalnya 3
  const displayedJobs = jobs.slice(0, 3);

  return (
    <Card className="jobportal-section my-1 w-full">
      <div className="flex items-center space-x-2 mb-4">
        <SparklesIcon className="size-6 text-green-600" />
        <Title level={5} className="text-green-600 !mb-0">Recommended Jobs</Title>
      </div>
      
      <List
        itemLayout="vertical"
        dataSource={displayedJobs}
        renderItem={(job, index) => (
          <List.Item key={job.job_id || index} className="border-b border-gray-200 py-3 px-0">
            <div className="flex flex-col space-y-1">
              <p className="text-base font-semibold">{job.title}</p>
              <p className="text-sm text-gray-600">
                {job.company?.market_name || job.company?.legal_name || 'Unknown Company'}
              </p>
              <p className="text-xs text-gray-500">
                {job.location} | {job.employment_type} | {job.work_type}
              </p>
              <p className="text-xs text-gray-500">
                Expires: {dateToMonthYear(job.expired_at)}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {job.description ? job.description.substring(0, 100) + '...' : 'No description available.'}
              </p>
              <div className="flex justify-between items-center mt-2">
                <Button type="link" size="small" className="p-0 text-green-600">
                  View Details
                </Button>
                <Button type="primary" size="small" className="bg-green-600">
                  Apply
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
      {jobs.length > 3 && (
        <div className="text-center mt-4">
          <Button type="link" className="text-green-600">See all recommendations ({jobs.length - 3} more)</Button>
        </div>
      )}
    </Card>
  );
};

export default RecommendedJobs;