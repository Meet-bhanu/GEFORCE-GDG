import React, { useEffect, useRef } from 'react';
import './ReflectiveCard.css';
import { Fingerprint as FingerprintIcon, Activity as ActivityIcon, Lock as LockIcon, User as UserIcon } from 'lucide-react';

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
  name?: string;
  role?: string;
  idNumber?: string;
}

const ReflectiveCard = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(0, 0, 0, 0.2)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {},
  name = 'ALEXANDER DOE',
  role = 'SENIOR DEVELOPER',
  idNumber = '8901-2345-6789'
}: ReflectiveCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasWebcam, setHasWebcam] = React.useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        const constraints = {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        };

        // Try with ideal constraints first
        stream = await navigator.mediaDevices.getUserMedia(constraints)
          .catch(() => {
            // Fallback to any video device
            console.warn('Strict webcam constraints failed, trying basic video...');
            return navigator.mediaDevices.getUserMedia({ video: true });
          });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasWebcam(true);
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setHasWebcam(false);
      }
    };

    startWebcam();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  } as React.CSSProperties;

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <video ref={videoRef} autoPlay playsInline muted className={`reflective-video ${!hasWebcam ? 'hidden' : ''}`} />
      {!hasWebcam && (
        <div className="reflective-video-fallback">
          <div className="fallback-avatar">
            <UserIcon size={120} strokeWidth={1} />
          </div>
          <div className="fallback-gradient" />
        </div>
      )}

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <LockIcon size={12} className="security-icon" />
            <span>SECURE ACCESS</span>
          </div>
          <ActivityIcon className="status-icon" size={18} />
        </div>

        <div className="card-body">
          <div className="user-info">
            <h2 className="user-name">{name}</h2>
            <p className="user-role">{role}</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">VERIFICATION ID</span>
            <span className="value">{idNumber}</span>
          </div>
          <div className="fingerprint-section">
            <FingerprintIcon size={28} className="fingerprint-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
