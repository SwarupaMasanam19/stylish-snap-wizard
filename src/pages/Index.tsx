
import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { TryOnCanvas } from "@/components/TryOnCanvas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [userPhoto, setUserPhoto] = useState<File | null>(null);
  const [clothingPhoto, setClothingPhoto] = useState<File | null>(null);

  const handleTryOn = () => {
    if (!userPhoto || !clothingPhoto) {
      toast.error("Please upload both photos first");
      return;
    }
    toast.success("Images loaded into canvas!");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              AI Fashion Revolution
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your wardrobe with AI-powered virtual try-on technology
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 animate-fade-up" style={{ "--delay": "200ms" } as any}>
            <ImageUploader
              onImageSelect={setUserPhoto}
              label="Upload Your Photo"
            />
            <ImageUploader
              onImageSelect={setClothingPhoto}
              label="Upload Clothing Item"
            />
          </div>

          <div className="flex justify-center animate-fade-up" style={{ "--delay": "400ms" } as any}>
            <Button
              size="lg"
              onClick={handleTryOn}
              className="px-8 py-6 text-lg"
              disabled={!userPhoto || !clothingPhoto}
            >
              Try On
            </Button>
          </div>

          {(userPhoto || clothingPhoto) && (
            <div className="animate-fade-up" style={{ "--delay": "600ms" } as any}>
              <TryOnCanvas userPhoto={userPhoto} clothingPhoto={clothingPhoto} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
