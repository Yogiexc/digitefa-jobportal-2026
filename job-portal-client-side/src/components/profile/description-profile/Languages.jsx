import { Button, Form, Input, Modal } from 'antd';
import LanguagesIcon from "../../../assets/svg/Languages.svg"

const Languages = ({ open, section, setOpen, action }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    await action(section, 'post', { values })
    setOpen(section, false);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(section, false);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={LanguagesIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Languages</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={665}
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
        requiredMark={false}
        onFinish={handleFinish}
        className='text-right'
      >
        <Form.Item
          name="language_name"
          label="Language Name"
          rules={[
            { required: true, message: 'Language name cannot be empty' },
          ]}
        >
          <Input
            style={{
              borderRadius: 12,
              height: 56
            }}
          />
        </Form.Item>
        <div className="mt-7" style={{ textAlign: 'center' }}>
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

export default Languages;
