
import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Card } from "./ui/card";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  label: string;
}

export const ImageUploader = ({ onImageSelect, label }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect(file);
    toast.success("Image uploaded successfully!");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card
      className={`relative p-6 transition-all duration-300 ${
        isDragging ? "border-primary scale-102" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        title="Upload image"
      />
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <>
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">{label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to upload
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
