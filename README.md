# 🛡️ Premium Life Insurance Prediction API

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.6%2B-orange.svg?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063.svg?logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

An end-to-end Machine Learning REST API built with **FastAPI** that predicts an individual's insurance premium category (**Low**, **Medium**, or **High**) based on their demographic, biometric, economic, and lifestyle factors.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Feature Engineering & Business Logic](#-feature-engineering--business-logic)
- [API Endpoints](#-api-endpoints)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Testing the API](#-testing-the-api)
- [License](#-license)

---

## 📖 Overview

Determining insurance premiums involves complex risk profiling. This project automates the assessment using a pre-trained **Scikit-Learn Random Forest Pipeline**. 

When a user submits raw data (such as age, height, weight, smoking habits, income, city, and occupation), the API:
1. Validates the input using **Pydantic v2**.
2. Dynamically derives features like **BMI**, **Lifestyle Risk**, **Age Group**, and **City Tier**.
3. Normalizes city names and maps aliases.
4. Feeds the features into the Machine Learning pipeline to classify the expected premium tier.

---

## ✨ Key Features

- **Interactive Web Interface**: Modern glassmorphism UI with real-time BMI gauge, risk assessment, quick customer presets, and live prediction results.
- **High-Performance REST API**: Built on **FastAPI** and served with **Uvicorn ASGI**.
- **Automated Feature Engineering**: Uses Pydantic `@computed_field` to calculate BMI, age groups, lifestyle risk levels, and location tiers on the fly.
- **Smart City Normalization**: Cleans whitespace, handles casing, and maps common aliases (e.g., `Bengaluru` ➔ `Bangalore`, `New Delhi` ➔ `Delhi`).
- **Interactive Documentation**: Instant auto-generated OpenAPI Swagger UI (`/docs`) and ReDoc (`/redoc`).
- **Production-Ready ML Pipeline**: Includes backward-compatibility patches for cross-version model unpickling.

---

## 📂 Project Structure

```text
├── app.py                      # FastAPI application entry point & route definitions
├── static/                     # Web Frontend files
│   ├── index.html              # Responsive glassmorphism web interface
│   ├── style.css               # Vanilla CSS design system & animations
│   └── app.js                  # Frontend controller, live gauges & API fetch logic
├── config/
│   └── cities.py               # Tier 1 and Tier 2 Indian city classifications
├── model/
│   ├── insurance.csv           # Reference dataset for model training
│   ├── model.pkl               # Trained Scikit-Learn Pipeline model
│   └── predict.py              # ML model loading & inference logic
├── schema/
│   ├── user_input.py           # Pydantic input schema with validation & computed fields
│   └── prediction_response.py  # Pydantic response schema
├── guide.txt                   # In-depth architectural & testing guide
├── requirements.txt            # Project dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## ⚙️ Feature Engineering & Business Logic

The model expects 6 derived features. The API transforms raw user inputs automatically:

| Feature | Computation / Logic |
| :--- | :--- |
| **`bmi`** | `weight (kg) / [height (m)]²` |
| **`lifestyle_risk`** | • `high`: Smoker **AND** BMI > 30<br>• `medium`: Smoker **OR** BMI > 27<br>• `low`: Non-smoker and BMI ≤ 27 |
| **`age_group`** | • `young`: < 25<br>• `adult`: 25 to 44<br>• `middle_aged`: 45 to 59<br>• `senior`: ≥ 60 |
| **`city_tier`** | • `1`: Tier 1 cities (Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune)<br>• `2`: Tier 2 cities (Jaipur, Indore, Lucknow, Surat, etc.)<br>• `3`: All other cities |
| **`income_lpa`** | Annual income in Lakhs Per Annum (LPA) |
| **`occupation`** | Permitted categories: `retired`, `freelancer`, `student`, `government_job`, `business_owner`, `unemployed`, `private_job` |

---

## 🚀 API Endpoints

### 1. Health Check
- **Endpoint**: `GET /`
- **Response**:
```json
{
  "message": "Insurance Premium Prediction API"
}
```

### 2. Predict Premium
- **Endpoint**: `POST /predict`
- **Request Body**:
```json
{
  "age": 69,
  "weight": 119.0,
  "height": 1.56,
  "income_lpa": 2.52,
  "smoker": false,
  "city": "Jaipur",
  "occupation": "retired"
}
```
- **Response** (`200 OK`):
```json
{
  "premium_category": "High"
}
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.10+ installed
- Git installed

### 1. Clone the Repository
```bash
git clone https://github.com/rohitkumar305/Premimum-Life-Insurance-Prediction.git
cd Premimum-Life-Insurance-Prediction
```

### 2. Create and Activate a Virtual Environment
```bash
# Windows (PowerShell)
py -3.10 -m venv venv
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate.bat

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 💻 Running the Application

### Option A: Direct Python Execution
```bash
python app.py
```

### Option B: Using Uvicorn CLI
```bash
uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

Once running, the server is accessible at `http://127.0.0.1:8000`.

---

## 🧪 Testing the API

### 1. Interactive Swagger UI (Browser)
Open your browser and navigate to:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

Click on `POST /predict` ➔ **Try it out** ➔ **Execute**.

### 2. cURL
```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight": 68.0,
    "height": 1.78,
    "income_lpa": 25.0,
    "smoker": false,
    "city": "Mumbai",
    "occupation": "private_job"
  }'
```
**Output**: `{"premium_category":"Low"}`

### 3. Windows PowerShell
```powershell
$body = @{
    age = 69
    weight = 119.0
    height = 1.56
    income_lpa = 2.52
    smoker = $false
    city = "Jaipur"
    occupation = "retired"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/predict" -Method POST -ContentType "application/json" -Body $body
```

---

## 📄 License

This project is licensed under the MIT License - feel free to use and modify it.
