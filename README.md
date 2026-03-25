Steps to run:
In backend folder:
pyhton app.py

In client folder: 
npm install
npm run dev
# factFind – News Truth Checker

![Python](https://img.shields.io/badge/Python-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-green?style=flat-square)
![React](https://img.shields.io/badge/React-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green)

factFind is a web app that checks whether a news article is **reliable or unreliable** using NLP and machine learning.

Paste a news article URL, and the app analyzes the content and returns a verdict.

---

## How It Works

* User enters article URL in the frontend
* Frontend sends request to FastAPI backend
* Backend extracts article text using newspaper3k
* Text is cleaned and processed
* ML model predicts reliability
* Result is returned and displayed

---

## Model Overview

* **Dataset:** ~45,000 articles (Real + Fake)
* **Preprocessing:** lowercasing, punctuation removal, text cleaning
* **Vectorization:** TF-IDF
* **Model:** LinearSVC (SVM)
* **Split:** 80% training, 20% validation
* **Accuracy:** ~93%

**Pipeline:**

```
Text → Clean → TF-IDF → LinearSVC → Prediction
```

---

## Tech Stack

* **Frontend:** React + TypeScript
* **Backend:** FastAPI
* **ML:** Scikit-learn
* **Article Extraction:** newspaper3k
* **Model Loading:** joblib
* **Server:** Uvicorn

---

## Running the App

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/factfind.git
cd factfind
```

### 2. Run Backend

```bash
pip install fastapi uvicorn scikit-learn newspaper3k joblib
uvicorn app:app --reload
```

Backend runs on:

```
http://localhost:8000
```

### 3. Run Frontend

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## API

### POST `/predict`

**Request**

```json
{
  "url": "https://example.com/news-article"
}
```

**Response**

```json
{
  "label": "Reliable"
}
```

---

## Notes

* Works best with full article pages (not homepages)
* Dataset is mostly american political news
* Not accurate for other categories
* Some website formats not supported

