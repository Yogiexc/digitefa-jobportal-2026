import { Button, Form, Input, Modal, message, } from "antd";
import EditProfileIcon from "../../../assets/svg/Edit.svg";

const EditProfile = ({ open, setOpen, userData }) => {
  const [form] = Form.useForm();


  const handleFinish = () => {
    message.success("Profile updated successfully!");
    setOpen();
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };


  return (
    <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={EditProfileIcon}
              alt="Edit Data"
              className="menu-icon"
              style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
            />
            <span>Edit Profile</span>
          </div>
        }
        centered
        visible={open}
        onCancel={handleCancel}
        width={500}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <hr style={{ flex: 1, borderColor: "#E9E9E9", margin: 3, borderWidth: "1px" }} />
        </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          full_name: userData?.name,
          phone_number: userData?.phone_number,
          email: userData?.email,
        }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="full_name"
          label="Full Name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
         <Input style={{ borderRadius: 12, height: 56 }} />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Phone Number"
          rules={[{ required: true, message: "Please input your phone number!" }]}
        >
          <Input style={{ borderRadius: 12, height: 56 }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
        >
          <Input style={{ borderRadius: 12,  height: 56 }} disabled />
        </Form.Item>

         <div className="space-x-2" style={{ textAlign: "center" }}>
            <Button onClick={handleCancel}  style={{
              width: 120,
              height: 40,
              borderRadius: 12,
            }}>
              <span className="font-medium"> Cancel </span>
            </Button>
            <Button
            type="primary"
            style={{
              width: 120,
              height: 40,
              borderRadius: 12,
            }}
          >
            <span className="font-medium"> Save</span>
            </Button>
          </div>
      </Form>
    </Modal>
  );
};

export default EditProfile;
