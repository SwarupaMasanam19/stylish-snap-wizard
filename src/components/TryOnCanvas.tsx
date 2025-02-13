
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
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

    // Enable object controls
    fabricCanvas.on('object:modified', () => {
      fabricCanvas.renderAll();
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
      if (!e.target?.result) return;

      FabricImage.fromURL(e.target.result as string, (img) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imgAspectRatio = img.width! / img.height!;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let scaleX = 1;
        let scaleY = 1;

        if (imgAspectRatio > canvasAspectRatio) {
          scaleX = canvasWidth / img.width!;
          scaleY = canvasWidth / img.width!;
        } else {
          scaleX = canvasHeight / img.height!;
          scaleY = canvasHeight / img.height!;
        }

        canvas.backgroundImage = img;
        img.set({
          scaleX,
          scaleY,
          originX: 'center',
          originY: 'center',
          left: canvasWidth / 2,
          top: canvasHeight / 2
        });
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(userPhoto);
  }, [userPhoto, canvas]);

  useEffect(() => {
    if (!canvas || !clothingPhoto) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      FabricImage.fromURL(e.target.result as string, (img) => {
        // Make the image draggable and resizable
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: 'center',
          originY: 'center',
          scaleX: 0.5,
          scaleY: 0.5,
          cornerStyle: 'circle',
          transparentCorners: false,
          cornerColor: '#ffffff',
          cornerStrokeColor: '#000000',
          borderColor: '#000000',
          cornerSize: 12,
          padding: 10,
          borderDashArray: [4, 4]
        });
        
        // Remove any existing clothing images
        const objects = canvas.getObjects();
        objects.forEach((obj) => canvas.remove(obj));
        
        // Add the new clothing image
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        
        toast.success("Drag and resize the clothing to fit!");
      }, {
        crossOrigin: 'anonymous' // Add CORS header
      });
    };
    reader.readAsDataURL(clothingPhoto);
  }, [clothingPhoto, canvas]);

  return (
    <Card className="p-4 w-full flex justify-center">
      <canvas 
        ref={canvasRef} 
        className="max-w-full touch-none rounded-lg shadow-lg border border-border/10" 
      />
    </Card>
  );
};
