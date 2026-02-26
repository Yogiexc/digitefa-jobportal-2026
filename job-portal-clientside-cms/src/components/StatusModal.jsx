import { Button, Modal, Typography } from "antd";
import SuccessIcon from "../assets/svg/Success.svg";
import DeleteIcon from "../assets/svg/Delete.svg";

const { Text } = Typography;

const StatusModal = ({ open, setOpen, status, message }) => {
  const handleOkay = () => {
    setOpen(false);
  };

  const icon = status === "success" ? SuccessIcon : DeleteIcon;
  const text = status === "success" ? "Success!" : "Failed!";

  return (
    <>
      <Modal
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={400}
        maskClosable={false}
        footer={
          <>
            <div className="flex justify-center">
              <Button key="submit" type="primary" onClick={handleOkay}   style={{
                width: "140px",
                height: "48px",
                borderRadius: "12px",
              }}>
                <span className="font-medium text-base"> Okay </span>
              </Button>
            </div>
          </>
        }
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >

        <div className="flex justify-center mb-3 text-center">
          <img src={icon} alt={status === "success" ? "Success" : "Failed"} />
        </div>

        <div className="flex justify-center mb-3 text-center">
          <Text className="text-xl font-semibold text-center">{text}</Text>
        </div>

        <div className="flex justify-center mb-7 text-center">
          <Text className="text-gray-400 text-base">{message}</Text>
        </div>
      </Modal>
    </>
  );
};

export default StatusModal;
