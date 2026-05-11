import { Button, Form, Input, Modal, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import CertificationLicensesIcon from "../../../assets/svg/CertificationsLicenses.svg";

const CertificationLicenses = ({ open, setOpen, section, initialValues, resetForm, action }) => {
  const [form] = Form.useForm();

  const closed = () => {
    resetForm({})
    setOpen(section, false)
    form.resetFields()
  }

  const handleFinish = async (values) => {
    if (initialValues && 'certification_id' in initialValues) {
      await action(section, 'put', { primaryKey: 'certification_id', values: { ...values, certification_id: initialValues?.certification_id } })
    } else {
      await action(section, 'post', { values })
    }
    closed()
  };

  const handleCancel = () => {
    closed()
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={CertificationLicensesIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>{initialValues && 'certification_id' in initialValues ? 'Edit Certification' : 'Add Certification'}</span>
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
          name="certification_name"
          label="License Name"
          rules={[{ required: true, message: 'License name cannot be empty' }]}
        >
          <Input style={{ borderRadius: 12, height: 56 }} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="issue_date"
              label="Issue Date"
              getValueProps={(val) => ({ value: val ? dayjs(val) : null })}
              rules={[{ required: true, message: 'Issues date cannot be empty' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="expiration_date"
              label="Expiration Date"
              getValueProps={(val) => ({ value: val ? dayjs(val) : null })}
              rules={[{ required: true, message: 'Expiration date cannot be empty' }]}
            >
              <DatePicker format={'MMMM YYYY'} picker='month' size='large' className='w-full' style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="issuing_organization"
              label="Issuing Organization"
              rules={[{ required: true, message: 'Issuing Organization cannot be empty' }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="credential_url"
              label="Credential URL"
              rules={[
                {
                  type: 'url',
                  warningOnly: true,
                },
                { required: true, message: 'Credential url cannot be empty' }
              ]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ textAlign: 'center' }}>
          <Button onClick={handleCancel} style={{ width: 120, height: 40, borderRadius: 12, borderColor: "#BBB", marginRight: 8 }}>
            <span className='font-medium'> Cancel </span>
          </Button>
          <Button type="primary" htmlType="submit" style={{ width: 120, height: 40, borderRadius: 12 }}>
            <span className='font-medium'> Save</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CertificationLicenses;
