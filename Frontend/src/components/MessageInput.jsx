import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Download } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Cloudinary URL
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "J_company"); // 🔁 Replace with yours
    const cloudName = "dugiuobq3"; // 🔁 Replace with yours

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setImagePreview(data.secure_url); // ✅ Use URL
        toast.success("Image ready to send");
      } else {
        toast.error("Image upload failed");
        console.error("Cloudinary error", data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Image upload failed");
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Message send failed");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              onClick={() => setShowModal(true)} // 📍 Add this
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 cursor-pointer"
            />

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {/* ✅ Image Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-base-100 p-4 rounded-lg max-w-3xl w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-800"
            >
              <X size={20} />
            </button>
            <img
              src={imagePreview}
              alt="Full Preview"
              className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
            />
            <div className="mt-4 text-center">
              <a
                href={imagePreview}
                download={`chat-image-${Date.now()}.jpg`}
                className="btn btn-sm btn-primary"
              >
                <Download size={16} className="mr-1" /> Download Image
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MessageInput;
