import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, FileText, ChevronRight } from 'lucide-react';
import './PatientList.css';

export default function PatientList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ first_name: '', last_name: '', medical_id: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Mock add patient
      const newPatientWithId = {
        ...newPatient,
        id: Date.now(),
        last_visit_date: null,
        visits: []
      };
      const updatedPatients = [newPatientWithId, ...patients];
      localStorage.setItem('mock_patients', JSON.stringify(updatedPatients));
      setPatients(updatedPatients);
      setIsModalOpen(false);
      setNewPatient({ first_name: '', last_name: '', medical_id: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Mock fetch patients
        let data = JSON.parse(localStorage.getItem('mock_patients'));
        if (!data) {
          data = [
            { id: 1, first_name: 'John', last_name: 'Doe', medical_id: 'MED-001', last_visit_date: '2023-10-15', visits: [{ date: '2023-10-15', diagnosis: 'Moderate NPDR' }] },
            { id: 2, first_name: 'Jane', last_name: 'Smith', medical_id: 'MED-002', last_visit_date: '2023-11-02', visits: [] },
            { id: 3, first_name: 'Robert', last_name: 'Johnson', medical_id: 'MED-003', last_visit_date: '2023-12-20', visits: [{ date: '2023-12-20', diagnosis: 'Severe NPDR' }] },
          ];
          localStorage.setItem('mock_patients', JSON.stringify(data));
        }
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

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

      <div className="dashboard-content" style={{ flexDirection: 'column', overflowY: 'auto', padding: '2rem' }}>
        <div className="patient-list-header">
          <h2>My Patients</h2>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={() => setIsModalOpen(true)}>
            + Add Patient
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading patients...</div>
        ) : (
          <div className="patients-grid">
            {patients.map(patient => (
              <div 
                key={patient.id} 
                className="patient-card"
                onClick={() => navigate(`/patient/${patient.id}`)}
              >
                <div className="patient-card-icon">
                  <Users size={24} color="#0df3ff" />
                </div>
                <div className="patient-card-info">
                  <h3>{patient.first_name} {patient.last_name}</h3>
                  <p className="medical-id">{patient.medical_id}</p>
                </div>
                <div className="patient-card-meta">
                  <span className="last-visit">
                    Last Visit: {patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString() : 'No visits'}
                  </span>
                  <ChevronRight size={20} color="#5e6c8e" />
                </div>
              </div>
            ))}
            
            {patients.length === 0 && (
              <div className="empty-patients">
                <FileText size={48} color="#5e6c8e" />
                <p>No patients found. Add your first patient to begin.</p>
              </div>
            )}
          </div>
        )}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Add New Patient</h2>
              <form onSubmit={handleAddPatient}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>First Name</label>
                  <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#fff', color: '#000' }} value={newPatient.first_name} onChange={e => setNewPatient({...newPatient, first_name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Last Name</label>
                  <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#fff', color: '#000' }} value={newPatient.last_name} onChange={e => setNewPatient({...newPatient, last_name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Medical ID</label>
                  <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#fff', color: '#000' }} value={newPatient.medical_id} onChange={e => setNewPatient({...newPatient, medical_id: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
