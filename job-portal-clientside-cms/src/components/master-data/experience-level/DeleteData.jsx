import { useState } from "react";
import { Button, Modal, Typography } from "antd";
import Api from "../../../services/Api";
import StatusModal from "../../StatusModal";
import DeleteIcon from "../../../assets/svg/Delete.svg";

const { Text } = Typography;

const DeleteData = ({ open, setOpen, experienceLevelId, fetchData }) => {
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");

  const handleDelete = () => {
    Api.delete(`experience-levels/${experienceLevelId.experience_level_id}`).then(
      (res) => {
        const { message, status } = res;
        setModalMessage(message);
        setModalStatus(status === "success" ? "success" : "failed");
        setOpen(false);
        fetchData();
        setOpenStatusModal(true);
      }
    );
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        centered
        open={open}
        onCancel={handleCancel}
        width={400}
        maskClosable={false}
        footer={
          <div className="flex justify-center">
            <Button
              className="font-semibold mr-3"
              onClick={handleCancel}
              style={{ height: 48, borderRadius: "12px" }}
            >
              No, cancel
            </Button>
            <Button
              type="primary"
              className="font-semibold mr-3"
              onClick={handleDelete}
              style={{ height: 48, borderRadius: "12px" }}
            >
              Yes, delete
            </Button>
          </div>
        }
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div className="flex justify-center mb-3">
          <img src={DeleteIcon} alt="Confirm Delete" />
        </div>
        <div className="flex justify-center mb-3">
          <Text className="text-xl font-semibold text-center">
            Delete Data
            {" '" + experienceLevelId?.name + "'?"}
          </Text>
        </div>
        <div className="flex justify-center mb-7 text-center">
          <Text className="text-gray-400 text-base">
            {`Are you sure you want to delete this data? Once it's gone, it's gone!`}
          </Text>
        </div>
      </Modal>
      <StatusModal
        open={openStatusModal}
        setOpen={setOpenStatusModal}
        message={modalMessage}
        status={modalStatus}
      />
    </>
  );
};

export default DeleteData;
