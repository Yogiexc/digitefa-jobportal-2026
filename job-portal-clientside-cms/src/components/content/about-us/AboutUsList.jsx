import { useState, useEffect } from "react";
import { Button, Layout, Typography, message } from "antd";
import EditData from "../about-us/EditData";
import ReactQuill from "react-quill";
import Api from "../../../services/Api";
import StatusModal from "../../StatusModal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const { Text } = Typography;
const { Content } = Layout;

const AboutUsList = () => {
  const [value, setValue] = useState("");
  const [openEditData, setOpenEditData] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  useEffect(() => {
    const quillContainer = document.querySelector(".ql-container");
    const quillEditor = document.querySelector(".ql-editor");

    if (quillContainer) {
      quillContainer.style.borderRadius = "12px";
      quillContainer.style.borderColor = "#E9E9E9";
      quillContainer.style.backgroundColor = "#FFF";
    }
    if (quillEditor) {
      quillEditor.style.borderRadius = "12px";
      quillEditor.style.backgroundColor = "#FFF";
    }
  }, []);

  const fetchData = () => {
    Api.get(`/content/about-us`)
      .then((response) => {
        const { data } = response;
        setValue(data);
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        message.destroy()
        message.error("About us not found. Please add content to the about us page");
      });
  };

  useEffect(() => {
    fetchData(openEditData);
  }, [openEditData]);

  return (
    <Content className="p-6 mt-3">
      {openEditData ? (
        <EditData
          open={openEditData}
          setOpen={setOpenEditData}
          setOpenStatusModal={setOpenStatusModal}
          setModalMessage={setModalMessage}
          setModalStatus={setModalStatus}
        />
      ) : (
        <div className="bg-white shadow-lg rounded-[20px] p-8">
          <div className="flex justify-between items-center mb-6">
            <Text className="text-xl font-medium">About Us</Text>
            <Button
              type="primary"
              style={{ height: 48, width: 130 }}
              className="rounded-2xl flex items-center justify-center"
              onClick={() => setOpenEditData(true)}
            >
              <PencilSquareIcon className="size-5" />
              <span className="text-base font-medium"> Edit Data </span>
            </Button>
          </div>
          <ReactQuill
            value={value}
            readOnly={true}
            modules={{ toolbar: false }}
          />
        </div>
      )}
      <StatusModal
        open={openStatusModal}
        setOpen={setOpenStatusModal}
        message={modalMessage}
        status={modalStatus}
      />
    </Content>
  );
};

export default AboutUsList;
