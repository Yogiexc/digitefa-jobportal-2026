import { Card, Row, Col, Button } from 'antd';

const jobData = [
  { title: 'Frontend Developer', company: 'Tech Corp', location: 'New York, NY' },
  { title: 'Backend Developer', company: 'Code Inc.', location: 'San Francisco, CA' },
];

const Contents = () => {
  return (
    <div className="contents">
      <h2>Latest Jobs Open</h2>
      <Row gutter={16}>
        {jobData.map((job, index) => (
          <Col span={8} key={index}>
            <Card title={job.title} bordered={false}>
              <p>{job.company}</p>
              <p>{job.location}</p>
              <Button type="primary">Apply</Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Button className="view-all-btn">View All Jobs</Button>
    </div>
  );
};

export default Contents;
