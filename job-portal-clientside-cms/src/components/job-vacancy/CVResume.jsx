import { Modal, Button, Typography } from "antd";
import { useState } from "react";
import { saveAs } from "file-saver";
import Api from "../../services/Api";
import StatusModal from "../StatusModal";
import DownloadIcon from "../../assets/svg/Download.svg";

const { Text } = Typography;

const CVResume = ({ open, setOpen, applicantsId }) => {
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDownload = async () => {
    Api.get(`/jobs/applicants/resume/${applicantsId}`)
      .then((res) => {
        const extension = res.data.split(".").pop();
        Api.get(`${API_URL}/${res.data}`, {
          responseType: "blob",
        })
          .then((response) => {
            saveAs(response, `resume-${applicantsId}.${extension}`);
          })
          .catch(() => {
            setModalMessage("Download failed");
            setModalStatus("failed");
            setOpenStatusModal(true);
          });
        //saveAs(`${API_URL}/${res.data}`, "resume.pdf");
        // setModalMessage("Download successful");
        // setModalStatus("success");
        // setOpen(false);
        // setOpenStatusModal(true);
      })
      .catch(() => {
        setModalMessage("Download failed");
        setModalStatus("failed");
        setOpenStatusModal(true);
      });
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
              <span className="font-medium text-[#232323] text-base">
                No, cancel
              </span>
            </Button>
            <Button
              type="primary"
              className="font-semibold"
              onClick={handleDownload}
              style={{ height: 48, borderRadius: "12px" }}
            >
              <span className="font-medium text-base">Yes, download</span>
            </Button>
          </div>
        }
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div className="flex justify-center mb-3">
          <img src={DownloadIcon} alt="Download CV Resume" />
        </div>
        <div className="flex justify-center mb-3">
          <Text className="text-xl font-semibold text-center">
            Download Resume
          </Text>
        </div>
        <div className="flex justify-center mb-7 text-center">
          <Text className="text-gray-400 text-base">
            Are you sure you want to download this resume?
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

export default CVResume;
