import { Button, Form, Input, Modal, message, Row, Col } from 'antd';
import PersonalInformationIcon from "../../../assets/svg/Personal.svg"

const Resume = ({ open, setOpen }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log('Form values:', values);
    message.success('Profile updated successfully!');
    setOpen(false);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={PersonalInformationIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Personal Information</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={800}
      height={600}
      maskClosable={false}
      destroyOnClose={true}
      footer={null}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <hr style={{ flex: 1, borderColor: '#E9E9E9', margin: 3, borderWidth: '1px' }} />
      </div>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
            >
              <Input style={{ borderRadius: 12, height: 56 }} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input.TextArea style={{ borderRadius: 12, height: 100 }} rows={1} />
            </Form.Item>
          </Col>
        </Row>
        <div className="mt-7" style={{ textAlign: 'center' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Resume;
