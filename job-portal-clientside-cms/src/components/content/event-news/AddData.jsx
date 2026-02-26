import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Radio, Upload, message } from "antd";
import ReactQuill from "react-quill";
import Api from "../../../services/Api";
import "react-quill/dist/quill.snow.css";

const AddData = ({
  setOpen,
  setOpenStatusModal,
  setModalMessage,
  setModalStatus,
}) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [fileList, setFileList] = useState([]);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ list: "bullet" }, { list: "ordered" }, { list: "check" }],
      ["blockquote"],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ clean: true }],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
    "color",
    "background",
  ];

  useEffect(() => {
    const quillContainer = document.querySelector(".ql-container");
    const quillEditor = document.querySelector(".ql-editor");
    const quillToolbar = document.querySelector(".ql-toolbar");

    if (quillContainer) {
      quillContainer.style.borderRadius = "0 0 0.5rem 0.5rem";
      quillContainer.style.borderColor = "#E9E9E9";
      quillContainer.style.backgroundColor = "#FFF";
    }
    if (quillEditor) {
      quillEditor.style.borderRadius = "0.5rem";
      quillEditor.style.borderColor = "#E9E9E9";
      quillEditor.style.backgroundColor = "#FFF";
    }
    if (quillToolbar) {
      quillToolbar.style.borderRadius = "0.6rem 0.6rem 0 0";
      quillToolbar.style.borderColor = "#E9E9E9";
      quillToolbar.style.backgroundColor = "#FFF";
    }
  }, []);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const newSlug = newTitle.toLowerCase().replace(/\s+/g, "-");
    setSlug(newSlug);
  };

  const handleSlugChange = (e) => {
    const newSlug = e.target.value.toLowerCase().replace(/\s+/g, "-");
    setSlug(newSlug);
  };

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setEventDate(formattedDate);
    } else {
      setEventDate(null);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setShowDatePicker(selectedCategory === "event");
  };

  const handleSave = async () => {
    form.validateFields().then((values) => {
      if (fileList.length === 0) {
        message.destroy();
        message.error("Please Upload Image");
        return;
      }
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("category", values.category);
      formData.append("content", content);

      if (fileList[0]) {
        formData.append("upload_image", fileList[0].originFileObj);
      }

      if (category === "event" && eventDate) {
        formData.append("event_date", eventDate);
      }

      Api.post(`/content/event-news`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          const { message, status } = res;
          setOpen(false);
          setModalMessage(message);
          setModalStatus(status === "success" ? "success" : "failed");
          setOpenStatusModal(true);
        })
        .catch((error) => {
          message.destroy();
          console.error("Error creating event or news:", error);
          message.error(
            "Event or news slug already exists. Please create a new event or news with a different slug."
          );
        });
    });
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const validateImage = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div>
      <div className="bg-white shadow rounded-[20px] p-6">
        <Form
          form={form}
          layout="vertical"
          size="large"
          className="w-full"
          requiredMark={false}
        >
          <div className="grid grid-cols-2 gap-4 w-full">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input value={title} onChange={handleTitleChange} />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                {
                  required: false,
                },
                {
                  validator: (_, value) =>
                    value
                      ? !value.includes(" ")
                        ? Promise.resolve()
                        : Promise.reject(new Error("No spaces allowed"))
                      : Promise.resolve(),
                },
              ]}
            >
              <Input
                value={slug}
                onChange={handleSlugChange}
                placeholder={slug}
              />
            </Form.Item>
          </div>

          <div className="flex gap-4 w-full">
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Radio.Group onChange={handleCategoryChange} value={category}>
                <Radio.Button
                  value="news"
                  className="justify-center"
                  style={{ width: 110, height: 56 }}
                >
                  News
                </Radio.Button>
                <Radio.Button
                  value="event"
                  className=" justify-center"
                  style={{ width: 110, height: 56 }}
                >
                  Event
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {showDatePicker && (
              <Form.Item name="event_date" label="Event Date">
                <DatePicker
                  format="DD MMMM YYYY"
                  onChange={handleDateChange}
                  style={{ width: 200, height: 56, borderRadius: 12 }}
                />
              </Form.Item>
            )}

            <div className="mb-4">
              <label>Cover Photo</label>
              <div className="custom-upload-image custom-tooltip mt-2">
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={handleFileChange}
                  onRemove={handleRemove}
                  beforeUpload={validateImage}
                >
                  {fileList.length === 0 && (
                    <Button
                      type="default"
                      icon={<UploadOutlined />}
                      style={{ height: 56 }}
                    >
                      Upload
                    </Button>
                  )}
                </Upload>
              </div>
            </div>
          </div>
        </Form>

        <ReactQuill
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
        />

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            style={{ width: 120, height: 40, borderRadius: 12 }}
            onClick={handleSave}
          >
            <span className="font-medium">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddData;
