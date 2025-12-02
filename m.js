import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import axios from "axios";
import { Hand, Camera as CameraIcon, Activity, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FingerCounter = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ total_detections: 0, most_common_count: null });
  const [history, setHistory] = useState([]);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const lastCountRef = useRef(null);
  const lastSaveTime = useRef(0);

  // Count fingers based on landmarks
  const countFingers = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return 0;

    const handLandmarks = landmarks[0];
    let count = 0;

    // Thumb (check x position)
    const thumbTip = handLandmarks[4];
    const thumbIP = handLandmarks[3];
    if (thumbTip.x < thumbIP.x) {
      count++;
    }

    // Other fingers (check y position)
    const fingerTips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    const fingerPIPs = [6, 10, 14, 18];

    fingerTips.forEach((tipIndex, i) => {
      if (handLandmarks[tipIndex].y < handLandmarks[fingerPIPs[i]].y) {
        count++;
      }
    });

    return count;
  };

  // Save count to backend (debounced)
  const saveCount = async (count) => {
    const now = Date.now();
    if (now - lastSaveTime.current < 2000) return; // Save at most every 2 seconds
    
    lastSaveTime.current = now;
    try {
      await axios.post(`${API}/finger-count`, { count });
      fetchStats();
    } catch (error) {
      console.error("Error saving count:", error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/finger-count/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch history
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/finger-count/history`);
      setHistory(response.data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Handle results from MediaPipe
  const onResults = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw hand landmarks and connections with custom colors
        drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#00F5FF",
          lineWidth: 4,
        });
        drawLandmarks(ctx, landmarks, {
          color: "#FF1493",
          fillColor: "#00F5FF",
          radius: 6,
          lineWidth: 2,
        });
      }

      // Count fingers
      const count = countFingers(results.multiHandLandmarks);
      setFingerCount(count);

      // Save to backend if count changed
      if (count !== lastCountRef.current && count >= 0) {
        lastCountRef.current = count;
        saveCount(count);
      }
    } else {
      setFingerCount(0);
    }

    ctx.restore();
  };

  // Initialize MediaPipe Hands
  const initializeCamera = async () => {
    try {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // Start camera
      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: 1280,
          height: 720,
        });
        camera.start();
        cameraRef.current = camera;
        setIsActive(true);
        toast.success("Camera started successfully!");
      }
    } catch (error) {
      console.error("Error initializing camera:", error);
      toast.error("Failed to start camera. Please check permissions.");
    }
  };

  // Cleanup
  useEffect(() => {
    fetchStats();
    fetchHistory();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="finger-counter-container" data-testid="finger-counter-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <Hand className="logo-icon" />
            <h1 className="app-title">Finger Counter AI</h1>
          </div>
          <p className="app-subtitle">Real-time hand tracking with AI</p>
        </div>
      </header>

      <div className="main-content">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-container" data-testid="video-container">
            <video
              ref={videoRef}
              className="video-element"
              data-testid="video-element"
              style={{ display: "none" }}
            />
            <canvas
              ref={canvasRef}
              className="canvas-element"
              data-testid="canvas-element"
              width={1280}
              height={720}
            />
            
            {/* Finger Count Display */}
            <div className="count-overlay" data-testid="count-overlay">
              <div className="count-display" data-testid="count-display">
                <span className="count-number" data-testid="count-number">{fingerCount}</span>
                <span className="count-label">fingers</span>
              </div>
            </div>

            {!isActive && (
              <div className="camera-placeholder" data-testid="camera-placeholder">
                <CameraIcon size={80} />
                <p>Click Start Camera to begin</p>
              </div>
            )}
          </div>

          {/* Control Button */}
          {!isActive && (
            <button
              className="start-button"
              onClick={initializeCamera}
              data-testid="start-camera-button"
            >
              <CameraIcon size={20} />
              Start Camera
            </button>
          )}
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-card" data-testid="stats-card">
            <div className="stat-item">
              <Activity className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Total Detections</span>
                <span className="stat-value" data-testid="total-detections">{stats.total_detections}</span>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Most Common</span>
                <span className="stat-value" data-testid="most-common-count">
                  {stats.most_common_count !== null ? `${stats.most_common_count} fingers` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="history-card" data-testid="history-card">
            <h3 className="history-title">Recent History</h3>
            <div className="history-list">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={index} className="history-item" data-testid={`history-item-${index}`}>
                    <span className="history-count">{item.count}</span>
                    <span className="history-label">fingers</span>
                  </div>
                ))
              ) : (
                <p className="no-history" data-testid="no-history">No history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FingerCounter;