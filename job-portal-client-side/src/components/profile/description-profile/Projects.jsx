import { useState } from 'react';
import { Button, Form, Input, Modal, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import ProjectsIcon from "../../../assets/svg/Projects.svg"

const Projects = ({ open, setOpen, section, initialValues, resetForm, action }) => {
  const form = Form.useFormInstance();
  const [inputValue, setInputValue] = useState('');

  const closed = () => {
    resetForm({})
    setOpen(section, false)
  }

  const handleFinish = async (values) => {
    if (initialValues && 'project_id' in initialValues) {
      await action(section, 'put', { primaryKey: 'project_id', values: { ...values, project_id: initialValues?.project_id } })
    } else {
      await action(section, 'post', { values })
    }

    closed()
  };

  const handleCancel = () => {
    closed()
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const characterLimit = 250;
  const isOverLimit = inputValue.length > characterLimit;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={ProjectsIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Projects</span>
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
          name="project_name"
          label="Projects Name"
          rules={[{ required: true, message: 'Projects name cannot be empty' }]}
        >
          <Input style={{ borderRadius: 12, height: 56 }} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label="Start Date"
              getValueProps={(val) => ({ value: val?dayjs(val):null })}
              rules={[{ required: true, message: 'Start date cannot be empty' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label="End Date"
              getValueProps={(val) => ({ value: val?dayjs(val):null })}
              rules={[{ required: true, message: 'End date cannot be empty' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Description cannot be empty' },
            { max: characterLimit, message: `Maximum character limit is ${characterLimit}` }
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
            <span className='font-medium'> Cancel </span>
          </Button>
          <Button type="primary" htmlType="submit" style={{width: 120, height: 40, borderRadius: 12}}>
            <span className='font-medium'> Save </span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Projects;
