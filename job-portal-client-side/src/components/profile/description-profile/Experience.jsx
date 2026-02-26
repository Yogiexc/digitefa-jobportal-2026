import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Row, Col, DatePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import ExperienceIcon from "../../../assets/svg/Experiences.svg"

const Experience = ({ open, setOpen, section, initialValues, resetForm, action }) => {
  const form = Form.useFormInstance();
  const [inputValue, setInputValue] = useState('');
  const [isCurrentlyWork, setIsCurrentlyWork] = useState(false);

  const closed = () => {
    resetForm({})
    setOpen(section, false)
    form.resetFields();
    setIsCurrentlyWork(false)
  }

  const handleFinish = async (values) => {
    if (isCurrentlyWork) {
      values.end_date = values.start_date
    }

    if (initialValues && 'experience_id' in initialValues) {
      await action(section, 'put', { primaryKey: 'experience_id', values: { ...values, experience_id: initialValues?.experience_id } })
    } else {
      await action(section, 'post', { values })
    }

    closed()
  };

  

  const handleCancel = () => {
    closed();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const characterLimit = 250;
  const isOverLimit = inputValue.length > characterLimit;

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length !== 0 && initialValues.start_date === initialValues.end_date) {
      setIsCurrentlyWork(true)
    }
  }, [initialValues])



  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={ExperienceIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Experience</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={800}
      maskClosable={false}
      destroyOnClose={true}
      footer={null}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <hr style={{ flex: 1, borderColor: '#E9E9E9', margin: 3, borderWidth: '1px' }} />
      </div>
      <Form
        form={form}
        layout="vertical"
        requiredMark={true}
        onFinish={handleFinish}
        initialValues={initialValues}
        className='text-right'
      >
        <Form.Item
          name="experience_title"
          label="Job Tittle"
          rules={[{ required: true, message: 'Job tittle cannot be empty' }]}
        >
          <Input style={{ borderRadius: 12, height: 56 }} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: 'Company name cannot be empty' }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="employment_type"
              label="Employment Type"
              requiredMark={false}
            >
              <Select style={{ height: 56, borderRadius: 12 }} options={[{ value: 'Freelance', label: 'Freelance' }, { value: 'Fulltime', label: 'Fulltime' }]} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="location_type"
              label="Location Type"
              requiredMark={false}
            >
              <Select style={{ borderRadius: 12, height: 56 }} options={[{ value: 'Remote', label: 'Remote' }, { value: 'Onsite', label: 'Onsite' }]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Location"
            >
              <Input style={{ borderRadius: 12, height: 56 }} rows={1} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label="Start Date"
              getValueProps={(val) => ({ value: val?dayjs(val):null })}
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label="End Date"
              className='mb-auto'
              getValueProps={(val) => ({ value: val?dayjs(val):null })}
              hidden={isCurrentlyWork}
              rules={[{ required: !isCurrentlyWork, message: 'Please select start date' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
            <Form.Item
              name="currently_working"
              valuePropName="true"
              label={isCurrentlyWork ? "End Date" : ""}
            >
              <Checkbox checked={isCurrentlyWork} onChange={(e) => setIsCurrentlyWork(e.target.checked)}>I am currently working in this role</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Description"
          requiredMark={true}
          rules={[            
            { max: characterLimit, message: `Maximum character limit is ${characterLimit}` },
            { required: true, message: 'Please fill description' }
          ]}
        >
          <Input.TextArea
            style={{
              borderRadius: 12,
              height: 100,
              borderColor: isOverLimit ? 'red' : undefined
            }}
            value={inputValue}
            onChange={handleInputChange}
          />
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={handleCancel} style={{ width: 120, height: 40, borderRadius: 12, borderColor: "#BBB", marginRight: 8 }}>
            <span className='font-medium'>Cancel </span>
          </Button>
          <Button type="primary" htmlType="submit" style={{width: 120, height: 40, borderRadius: 12}}>
            <span className='font-medium'> Save </span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Experience;
