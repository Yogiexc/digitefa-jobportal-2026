import { useEffect, useState } from "react";
import { Button, Typography, message } from "antd";
import ReactQuill from "react-quill";
import Api from "../../../services/Api";
import "react-quill/dist/quill.snow.css";

const Quill = ReactQuill.Quill;
const Parchment = Quill.import("parchment");

Quill.register(Quill.import("attributors/style/direction"), true);
Quill.register(Quill.import("attributors/style/align"), true);

class IndentAttributor extends Parchment.Attributor.Style {
  add(node, value) {
    if (value === 0) {
      this.remove(node);
      return true;
    } else {
      return super.add(node, `${value}em`);
    }
  }
}

let IndentStyle = new IndentAttributor("indent", "text-indent", {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["1em", "2em", "3em", "4em", "5em", "6em", "7em", "8em", "9em"],
});

Quill.register(IndentStyle, true);

const { Text } = Typography;

const EditData = ({
  setOpen,
  setOpenStatusModal,
  setModalMessage,
  setModalStatus,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    Api.get(`/content/privacy-policy`)
      .then((response) => {
        const { data } = response;
        setValue(data);
      })
      .catch((error) => {
        console.error("Error fetching content:", error);
        message.destroy()
        message.error("Privacy policy not found. Please add content to the privacy policy page");     
      });
  }, []);

  const handleSave = async () => {
    Api.put(`/content/privacy-policy`, { content: value }) 
    .then((res) => {
      const { message, status } = res;
      setOpen(false);
      setModalMessage(message);
      setModalStatus(status === "success" ? "success" : "failed");
      setOpenStatusModal(true);
      })
      .catch((error) => {
        console.error("Error updating content:", error);
        message.error("Failed to update Privacy Policy content");
      });
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }], 
    [                
      { list: "bullet" },
      { list: "ordered" },
      { list: "check" },                  
    ],                 
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
    'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'align', 'color', 'background'
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

  return (
    <div>
      <div className="bg-white shadow rounded-[20px] p-6 ">
        <Text className="font-medium text-xl">Edit Privacy Policy</Text>
        <ReactQuill
          value={value}
          onChange={setValue}
          modules={modules}
          formats={formats}
          style={{marginTop: 16}}
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

export default EditData;
