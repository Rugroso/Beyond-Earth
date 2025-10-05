"use client";

import { useCallback, useContext } from "react";
import { EditorContext } from "@/contexts/editor-context";

export function useCanvasCapture() {
  const context = useContext(EditorContext);

  const validateRequirements = useCallback(() => {
    if (!context) return { isValid: false, message: "Context not available" };

    const { areRequirementsMet, getRequirementsStatus } = context;

    if (!areRequirementsMet()) {
      const status = getRequirementsStatus();
      const missing = status.filter((req) => !req.isMet);
      const missingList = missing
        .map((req) => `${req.name}: ${req.current}/${req.required} (need ${req.required - req.current} more)`)
        .join("\n");

      return {
        isValid: false,
        message: `Cannot export: Missing required items:\n\n${missingList}`
      };
    }

    return { isValid: true, message: "" };
  }, [context]);

  const createCanvasFromElement = useCallback(async () => {
    // Validate requirements before capture
    const validation = validateRequirements();
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const canvasElement = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvasElement) {
      throw new Error("Canvas element not found");
    }

    // Create a new canvas to capture the content
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");

    // Set canvas size to match the element (native dimensions)
    const rect = canvasElement.getBoundingClientRect();
    const nativeWidth = parseInt(canvasElement.style.width || "800");
    const nativeHeight = parseInt(canvasElement.style.height || "600");

    canvas.width = nativeWidth;
    canvas.height = nativeHeight;

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get all placed items and draw them on the canvas
    const placedItems = canvasElement.querySelectorAll("[data-placed-item]");

    placedItems.forEach((item) => {
      const itemElement = item as HTMLElement;
      const shape = itemElement.getAttribute("data-shape");
      const x = parseFloat(itemElement.getAttribute("data-x") || "0");
      const y = parseFloat(itemElement.getAttribute("data-y") || "0");
      const size = parseFloat(itemElement.getAttribute("data-size") || "80");

      const containerSize = size;
      const shapeSize = size * 0.5;

      // Draw the container background
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.beginPath();
      ctx.roundRect(x - containerSize / 2, y - containerSize / 2, containerSize, containerSize, 8);
      ctx.fill();

      // Draw the shape
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.save();
      ctx.translate(x, y);

      if (shape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(0, -shapeSize / 2);
        ctx.lineTo(shapeSize * 0.575, shapeSize / 2);
        ctx.lineTo(-shapeSize * 0.575, shapeSize / 2);
        ctx.closePath();
        ctx.fill();
      } else if (shape === "square") {
        ctx.fillRect(-shapeSize / 2, -shapeSize / 2, shapeSize, shapeSize);
      } else if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, shapeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    return canvas;
  }, [validateRequirements]);

  const downloadAsImage = useCallback(
    async (fileName = "asset") => {
      try {
        const canvas = await createCanvasFromElement();

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const timestamp = new Date().getTime();
          link.download = `${fileName}-${timestamp}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }, "image/png");
      } catch (error) {
        console.error("Failed to download image:", error);
        alert(error instanceof Error ? error.message : "Failed to download image");
        throw error;
      }
    },
    [createCanvasFromElement]
  );

  const getDataURL = useCallback(async () => {
    try {
      const canvas = await createCanvasFromElement();
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Failed to get data URL:", error);
      alert(error instanceof Error ? error.message : "Failed to get data URL");
      throw error;
    }
  }, [createCanvasFromElement]);

  const shareImage = useCallback(
    async (title = "My Beyond Earth Design") => {
      try {
        const canvas = await createCanvasFromElement();

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create blob"));
          }, "image/png");
        });

        // Check if Web Share API is available
        if (navigator.share && navigator.canShare) {
          const timestamp = new Date().getTime();
          const file = new File([blob], `beyond-earth-${timestamp}.png`, { type: "image/png" });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title,
              text: "Check out my Beyond Earth design!"
            });
            return true;
          }
        }

        // Fallback: just download the image
        await downloadAsImage();
        return false;
      } catch (error) {
        console.error("Failed to share image:", error);
        alert(error instanceof Error ? error.message : "Failed to share image");
        throw error;
      }
    },
    [createCanvasFromElement, downloadAsImage]
  );

  return {
    downloadAsImage,
    getDataURL,
    shareImage,
    validateRequirements
  };
}
