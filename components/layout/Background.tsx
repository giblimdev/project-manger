// components/ui/animated-background.tsx
"use client";

import React from "react";

interface AnimatedBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "dynamic";
}

export default function AnimatedBackground({
  className = "",
  intensity = "medium",
}: AnimatedBackgroundProps) {
  const getIntensityConfig = () => {
    switch (intensity) {
      case "subtle":
        return {
          pulseScale: 1.1,
          explosionScale: 2.5,
          explosionDuration: 8,
          pulseDuration: 6,
        };
      case "dynamic":
        return {
          pulseScale: 1.4,
          explosionScale: 4,
          explosionDuration: 12,
          pulseDuration: 4,
        };
      default:
        return {
          pulseScale: 1.2,
          explosionScale: 3,
          explosionDuration: 10,
          pulseDuration: 5,
        };
    }
  };

  const config = getIntensityConfig();

  return (
    <>
      {/* Styles globaux pour les animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background: linear-gradient(
              135deg,
              #f8fafc 0%,
              #e0f2fe 25%,
              #f3e8ff 50%,
              #fef3c7 75%,
              #f8fafc 100%
            );
          }
          25% {
            background: linear-gradient(
              135deg,
              #e0f2fe 0%,
              #f3e8ff 25%,
              #fef3c7 50%,
              #f8fafc 75%,
              #e0f2fe 100%
            );
          }
          50% {
            background: linear-gradient(
              135deg,
              #f3e8ff 0%,
              #fef3c7 25%,
              #f8fafc 50%,
              #e0f2fe 75%,
              #f3e8ff 100%
            );
          }
          75% {
            background: linear-gradient(
              135deg,
              #fef3c7 0%,
              #f8fafc 25%,
              #e0f2fe 50%,
              #f3e8ff 75%,
              #fef3c7 100%
            );
          }
        }

        @keyframes float-slow {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-20px, -30px) scale(1.2);
          }
        }

        @keyframes float-reverse {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(30px, -20px) scale(1.1);
          }
        }

        @keyframes float-diagonal {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-15px, 25px) scale(1.15);
          }
        }

        @keyframes pulse-gentle {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }

        @keyframes particle-drift {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translate(100px, -50px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes explosion-cycle {
          0%,
          90% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          95% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1);
          }
          98% {
            opacity: 0.08;
            transform: translate(-50%, -50%) scale(3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3.6);
          }
        }

        @keyframes texture-shift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }

        .animated-bg-gradient {
          animation: gradient-shift 20s ease-in-out infinite;
        }

        .animated-bg-orb-1 {
          animation:
            float-slow 5s ease-in-out infinite alternate,
            pulse-gentle 8s ease-in-out infinite;
        }

        .animated-bg-orb-2 {
          animation:
            float-reverse 5s ease-in-out infinite alternate,
            pulse-gentle 12s ease-in-out infinite 2s;
        }

        .animated-bg-orb-3 {
          animation:
            float-diagonal 7s ease-in-out infinite alternate,
            pulse-gentle 15s ease-in-out infinite 4s;
        }

        .animated-bg-explosion {
          animation: explosion-cycle 10s ease-out infinite;
        }

        .animated-bg-texture {
          animation: texture-shift 20s linear infinite;
        }
      `}</style>

      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        {/* Fond dégradé principal avec animation douce */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 animated-bg-gradient" />

        {/* Orbes flottantes avec pulsations */}
        <div className="absolute inset-0">
          {/* Orbe principale - grande et douce */}
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-20 animated-bg-orb-1"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Orbe secondaire */}
          <div
            className="absolute top-3/4 right-1/4 w-64 h-64 rounded-full opacity-15 animated-bg-orb-2"
            style={{
              background:
                "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(147, 51, 234, 0.08) 50%, transparent 70%)",
              filter: "blur(35px)",
            }}
          />

          {/* Orbe tertiaire */}
          <div
            className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full opacity-10 animated-bg-orb-3"
            style={{
              background:
                "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
        </div>

        {/* Particules subtiles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, rgba(${100 + i * 20}, ${150 + i * 15}, 255, 0.4) 0%, transparent 70%)`,
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                filter: "blur(1px)",
                animation: `particle-drift ${8 + i * 2}s linear infinite ${i * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Animation explosive cyclique */}
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full opacity-0 -translate-x-1/2 -translate-y-1/2 animated-bg-explosion"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 30%, transparent 60%)",
            filter: "blur(20px)",
          }}
        />

        {/* Overlay de texture subtile */}
        <div
          className="absolute inset-0 opacity-[0.02] animated-bg-texture"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </>
  );
}
