
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface TryOnCanvasProps {
  userPhoto: File | null;
  clothingPhoto: File | null;
}

export const TryOnCanvas = ({ userPhoto, clothingPhoto }: TryOnCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas || !userPhoto) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;
      img.onload = () => {
        canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width! / img.width,
          scaleY: canvas.height! / img.height,
        });
      };
    };
    reader.readAsDataURL(userPhoto);
  }, [userPhoto, canvas]);

  useEffect(() => {
    if (!canvas || !clothingPhoto) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target?.result as string, (img) => {
        // Make the image draggable and resizable
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        
        // Remove any existing clothing images
        const objects = canvas.getObjects();
        objects.forEach((obj) => canvas.remove(obj));
        
        // Add the new clothing image
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        toast.success("Clothing overlay added! You can now drag and resize it.");
      });
    };
    reader.readAsDataURL(clothingPhoto);
  }, [clothingPhoto, canvas]);

  return (
    <Card className="p-4 w-full flex justify-center">
      <canvas ref={canvasRef} className="max-w-full touch-none" />
    </Card>
  );
};
