import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Upload, FileBarChart, CheckCircle2, RotateCw, ArrowLeft, ArrowRight, Printer } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pipelineStage, setPipelineStage] = useState(0); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [patient, setPatient] = useState(null);
  const [pastVisit, setPastVisit] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Mock fetch patient
        const patients = JSON.parse(localStorage.getItem('mock_patients')) || [];
        const data = patients.find(p => p.id.toString() === id);
        
        if (data) {
          setPatient(data);
          if (data.visits && data.visits.length > 0) {
            // Visits are serialized, assume latest is first or last
            // Let's sort them by date descending to be sure
            const sorted = data.visits.sort((a,b) => new Date(b.date) - new Date(a.date));
            setPastVisit(sorted[0]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatientData();
  }, [id]);

  const simulateUpload = () => {
    setUploadedImage('/fundus-mock.png');
    setIsProcessing(true);
    setPipelineStage(1);
  };

  useEffect(() => {
    if (pipelineStage > 0 && pipelineStage <= 4) {
      const timer = setTimeout(() => {
        setPipelineStage(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (pipelineStage === 5) {
      setIsProcessing(false);
      // Here we would normally POST the new visit to the backend
    }
  }, [pipelineStage]);

  const steps = [
    { num: 1, title: 'Preprocessing', desc: 'CLAHE Enhancement & Normalization' },
    { num: 2, title: 'Feature Extraction', desc: 'GRESNET - 3584-dim Vector' },
    { num: 3, title: 'Refinement', desc: 'APSO Dimensionality Reduction' },
    { num: 4, title: 'Classification', desc: 'GPU-accelerated RSVM' }
  ];

  return (
    <div className="dashboard-container">
      <div className="topbar">
        <div className="nav-brand">
          <div className="brand-icon-pro">
            <Eye size={20} />
          </div>
          <h1>RetinaScan <span className="pro-badge">PRO</span></h1>
        </div>
        
        <div className="system-status">
          <div className="status-dot"></div>
          System Online
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-panel">
          {patient && (
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => navigate('/patients')}
                style={{ background: 'transparent', border: 'none', color: '#0df3ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={18} /> Back to List
              </button>
              <div>
                <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>{patient.first_name} {patient.last_name}</h2>
                <span style={{ color: '#0df3ff', fontSize: '0.9rem' }}>{patient.medical_id}</span>
              </div>
            </div>
          )}

          <div>
            {!uploadedImage ? (
              <div className="upload-container-outer">
                <div className="upload-area" onClick={simulateUpload}>
                  <div className="upload-icon-wrapper">
                    <Upload size={24} strokeWidth={1.5} color="#fff" />
                  </div>
                  <h3>Drag and drop image here</h3>
                  <p>or <span style={{ color: "var(--accent-blue)"}}>browse files</span> (JPEG, PNG)</p>
                </div>
              </div>
            ) : (
              <div className="uploaded-image-card">
                <img src={uploadedImage} alt="Fundus Scan" className="fundus-img" />
                <div className="image-overlay">
                  {isProcessing ? 'Analyzing...' : 'Analysis Complete'}
                </div>
              </div>
            )}
          </div>

          <div className="pipeline-section">
            <h3>Inference Pipeline</h3>
            <div className="pipeline-steps">
              {steps.map((step) => {
                const isActive = pipelineStage === step.num;
                const isCompleted = pipelineStage > step.num;

                return (
                  <div key={step.num} className={`step-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <div className="step-number">
                      {isCompleted ? <CheckCircle2 size={18} className="check-icon" /> : 
                       isActive ? <RotateCw size={18} className="spin-icon" /> : step.num}
                    </div>
                    <div className="step-info">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right-panel">
          {pipelineStage > 0 && (
            <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Analysis Report</h2>
                <p>Automated grading based on International Clinical DR Scale</p>
              </div>
              {pipelineStage === 5 && (
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={() => window.print()}>
                  <Printer size={16} /> Export PDF
                </button>
              )}
            </div>
          )}

          {/* Hidden Print Template */}
          {pipelineStage === 5 && patient && (
            <div className="print-only">
              <div className="print-header">
                <h2>RetinaScan PRO - Diagnostic Report</h2>
                <p><strong>Attending Physician:</strong> Dr. {patient.doctor_name || 'Admin'}</p>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
                  <p><strong>Patient Name:</strong> {patient.first_name} {patient.last_name}</p>
                  <p><strong>Medical ID:</strong> {patient.medical_id}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <h3>Diagnostic Finding: Mild NPDR</h3>
                <p>Model Confidence: 98.4%</p>
                <br/>
                <h4>Detected Features</h4>
                <ul>
                  <li>Microaneurysms detected in macular region</li>
                  <li>Hard exudates identified (count: 3)</li>
                  <li>No notable dot-and-blot hemorrhages</li>
                </ul>
              </div>
              {pastVisit && (
                 <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
                   <h4>Progress Comparison</h4>
                   <p>Previous Scan ({new Date(pastVisit.date).toLocaleDateString()}): {pastVisit.diagnosis}</p>
                   <p><strong>Conclusion:</strong> Condition has improved from Moderate NPDR.</p>
                 </div>
              )}
            </div>
          )}

          {pipelineStage === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FileBarChart size={64} strokeWidth={1} color="#5e6c8e" />
              </div>
              <h3>Awaiting Image</h3>
              <p>Upload a retinal fundus image to initialize the diagnostic<br/>pipeline.</p>
              
              {pastVisit && (
                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
                  <h4 style={{ color: '#5e6c8e', marginBottom: '1rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Visit Summary</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#8c9bba' }}>Date:</span>
                    <span style={{ color: '#fff' }}>{new Date(pastVisit.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8c9bba' }}>Diagnosis:</span>
                    <span style={{ color: '#ffb74d', fontWeight: '600' }}>{pastVisit.diagnosis}</span>
                  </div>
                </div>
              )}
            </div>
          ) : pipelineStage < 5 ? (
            <div className="empty-state analyzing-state">
              <div className="scanning-container">
                <div className="scan-line"></div>
                <div className="empty-icon scanning">
                  <FileBarChart size={80} strokeWidth={1} />
                </div>
              </div>
              <h3>Processing Scan...</h3>
              <p>Running model inference through APSO-GRESNET pipeline.</p>
            </div>
          ) : (
            <div className="results-state">
              {/* Progress Comparison Header */}
              {pastVisit && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(91, 121, 255, 0.1)', border: '1px solid rgba(91, 121, 255, 0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: '0.8rem', color: '#8c9bba', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Previous Scan</div>
                     <div style={{ color: '#ffb74d', fontWeight: '600' }}>{pastVisit.diagnosis}</div>
                   </div>
                   <div><ArrowRight size={20} color="#5e6c8e" /></div>
                   <div style={{ flex: 1, textAlign: 'right' }}>
                     <div style={{ fontSize: '0.8rem', color: '#8c9bba', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Current Scan</div>
                     <div style={{ color: '#0cf574', fontWeight: '600' }}>Mild NPDR</div>
                   </div>
                </div>
              )}

              <div className="grade-card positive-finding" style={pastVisit ? { background: 'rgba(12, 245, 116, 0.1)', borderColor: 'rgba(12, 245, 116, 0.3)' } : {}}>
                <div className="grade-label" style={pastVisit ? { color: '#0cf574' } : {}}>Predicted Diagnosis</div>
                <div className="grade-value">Mild NPDR</div>
                <div className="grade-subtext" style={pastVisit ? { color: '#0cf574' } : {}}>
                  {pastVisit ? 'Condition has improved from Moderate NPDR.' : 'Grade 1 - Non-Proliferative Diabetic Retinopathy'}
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-box">
                  <div className="metric-title">Model Confidence</div>
                  <div className="metric-score">98.4%</div>
                  <div className="confidence-bar"><div className="confidence-fill" style={{width: '98.4%'}}></div></div>
                </div>
                <div className="metric-box">
                  <div className="metric-title">Processing Time</div>
                  <div className="metric-score">6.01s</div>
                </div>
              </div>

              <div className="detailed-findings">
                <h3>Detected Features</h3>
                <ul className="findings-list">
                  <li><CheckCircle2 size={16} /> Microaneurysms detected in macular region</li>
                  <li><CheckCircle2 size={16} /> Hard exudates identified (count: 3)</li>
                  <li><CheckCircle2 size={16} /> No notable dot-and-blot hemorrhages</li>
                </ul>
              </div>
              
              <button className="btn-primary reset-btn" onClick={() => {
                setPipelineStage(0);
                setUploadedImage(null);
              }}>
                Save & Start Next Scan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
