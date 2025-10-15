import { useState } from "react";
import FileUpload from "../global/FileUpload";
import { Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useUpdateRepairReportMutation } from "@/store/api/repair-return/repairApi";

function RepairAdminImageModal({ isOpen, onClose, returnId }: any) {
  const [formData, setFormData] = useState({
    returnId,
    beforePhotos: [] as string[],
  });
  const [updateRepairReport, { isLoading: isUpdating }] =
    useUpdateRepairReportMutation();
  const submitData = async () => {
    // async () => {
      try {
        await updateRepairReport({
          id: returnId,
          data: { product_send_productImages: formData.beforePhotos },
        }).unwrap();
        toast.success("Received images updated successfully!");
        onClose();
      } catch (err) {
        toast.error("Failed to update received images");
    //   }
    };
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Send Product Images
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Before Photos Upload */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium"></label>
          <FileUpload
            files={formData.beforePhotos}
            setFiles={(urls) =>
              setFormData({ ...formData, beforePhotos: urls })
            }
          />
        </div>

        {/* Save Button */}
        <button
            onClick={submitData}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
        >
          Save Images
        </button>
      </div>
    </div>
  );
}
export default RepairAdminImageModal;
