import React from "react";

interface MorphGradientBackgroundProps {
  blob1Color?: string; // Tailwind color class, e.g. "bg-blue-300"
  blob2Color?: string; // Tailwind color class, e.g. "bg-purple-300"
  className?: string; // Additional classes for the container
  size?: string; // Size of the blobs, e.g. "30%"
}

export const BlobBg: React.FC<MorphGradientBackgroundProps> = ({
  blob1Color = "bg-cyan-800",
  blob2Color = "bg-teal-600",
  className,
  size = "30%",
}) => {
  return (
    <div className={`${className} `}>
      <div className=" pointer-events-none">
        <div
          className={`absolute transition-all ${blob1Color}`}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.9,
            mixBlendMode: "screen",
            top: "20%",
            left: "80%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className={`absolute transition-all ${blob2Color}`}
          style={{
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.9,
            mixBlendMode: "screen",
            top: "30%",
            left: "95%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          className={`absolute transition-all ${blob1Color}`}
          style={{
            width: "30%",
            height: "30%",
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.9,
            mixBlendMode: "screen",
            top: "98%",
            left: "20%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className={`absolute transition-all ${blob2Color}`}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.9,
            mixBlendMode: "screen",
            top: "95%",
            left: "5%",
            transform: "translate(-50%, -50%)",
          }}
        />

      </div>
    </div>
  );
};


