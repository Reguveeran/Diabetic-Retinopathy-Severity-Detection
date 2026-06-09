from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data
PATIENTS = [
    {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "medical_id": "MED12345",
        "doctor_name": "Smith",
        "last_visit_date": "2026-04-01T10:00:00Z",
        "visits": [
            {
                "date": "2026-04-01T10:00:00Z",
                "diagnosis": "Moderate NPDR"
            }
        ]
    }
]

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    medical_id: str

@app.post("/api/auth/login/")
def login(req: LoginRequest):
    if req.username == "admin@hospital.org" and req.password == "admin123":
        return {"access": "fake-jwt-token", "refresh": "fake-refresh-token"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/patients/")
def get_patients():
    return PATIENTS

@app.post("/api/patients/")
def create_patient(patient: PatientCreate):
    new_patient = {
        "id": len(PATIENTS) + 1,
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "medical_id": patient.medical_id,
        "doctor_name": "Smith",
        "last_visit_date": None,
        "visits": []
    }
    PATIENTS.insert(0, new_patient)
    return new_patient

@app.get("/api/patients/{patient_id}/")
def get_patient(patient_id: int):
    for p in PATIENTS:
        if p["id"] == patient_id:
            return p
    raise HTTPException(status_code=404, detail="Patient not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
