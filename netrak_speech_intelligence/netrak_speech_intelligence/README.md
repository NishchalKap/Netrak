# Netrak Speech Intelligence Service

> Experimental standalone prototype — excluded from the Netrak v1.0 release candidate. It is not connected to the gateway, citizen app, or operations workspace and has not completed production security, model-validation, load, or deployment certification. Examples below describe an intended prototype interface, not a deployed government capability.

**Experimental AI service prototype** — speech-analysis research for possible future scam-detection integration.

## Overview

Netrak Speech Intelligence Service is a modular AI inference pipeline that analyzes audio calls to detect:

* **Digital arrest scams**
* **Fake authority impersonation** (CBI, Police, ED, RBI, Customs, Courts)
* **Banking and payment scams**
* **Courier/parcel scams**
* **KYC, OTP, and UPI scams**
* **AI-generated/deepfake voices**
* **Money request patterns**
* **Threat and urgency language**
* **Remote access requests**

## Architecture

```
AUDIO FILE
    ↓
AUDIO VALIDATION & PREPROCESSING
    ↓
    ├─→ SPEECH-TO-TEXT (Whisper)
    ├─→ LANGUAGE IDENTIFICATION
    └─→ AI VOICE DETECTION
    ↓
TRANSCRIPT ANALYSIS
    ├─→ SCAM KEYWORD DETECTION
    ├─→ AUTHORITY IMPERSONATION DETECTION
    └─→ MONEY REQUEST DETECTION
    ↓
RISK SCORING ENGINE
    ↓
STRUCTURED JSON RESPONSE
```

## Features

✅ **Multilingual** - Supports Hindi, English, and Hinglish (code-switched)
✅ **GPU Accelerated** - NVIDIA A10G with CUDA 12.9
✅ **Modular Pipeline** - Independent, testable components
✅ **OpenAI Whisper** - Base multilingual model for speech-to-text
✅ **Voice Spoof Detection** - Hugging Face audio deepfake classifier
✅ **Explainable Risk Scoring** - Weighted, deterministic risk engine
✅ **FastAPI** - Prototype REST interface; production exposure is not approved
✅ **Databricks Apps** - Cloud-native deployment

## Technology Stack

* **Python 3.12**
* **PyTorch 2.9** with CUDA 12.9
* **OpenAI Whisper** - Speech-to-text
* **Hugging Face Transformers** - Voice spoof detection
* **FastAPI** - Web framework
* **Pydantic** - Data validation
* **Librosa** - Audio processing
* **Uvicorn** - ASGI server

## Project Structure

```
netrak_speech_intelligence/
├── app.py                     # FastAPI application
├── app.yaml                   # Databricks Apps config
├── requirements.txt           # Python dependencies
├── README.md                  # This file
│
├── config/
│   ├── __init__.py
│   └── settings.py            # Configuration and settings
│
├── models/
│   ├── __init__.py
│   ├── speech_to_text.py      # Whisper STT
│   └── voice_spoof_detector.py # AI voice detection
│
├── services/
│   ├── __init__.py
│   ├── audio_preprocessor.py  # Audio validation & preprocessing
│   ├── language_service.py    # Language identification
│   ├── keyword_service.py     # Scam keyword detection
│   ├── authority_service.py   # Authority impersonation detection
│   ├── money_service.py       # Money request detection
│   ├── risk_service.py        # Risk scoring engine
│   └── speech_pipeline.py     # Main pipeline orchestrator
│
├── schemas/
│   ├── __init__.py
│   └── speech_schema.py       # Pydantic API schemas
│
├── resources/
│   ├── scam_keywords.json     # Scam keyword patterns
│   ├── authorities.json       # Authority entities
│   └── payment_patterns.json  # Payment method patterns
│
├── tests/
│   ├── test_pipeline.py
│   └── test_api.py
│
├── test_audio/
│
└── docs/
    ├── MODEL_CARD.md
    ├── DATASET_DOCUMENTATION.md
    └── API_DOCUMENTATION.md
```

## Installation

### Prerequisites

* Python 3.12+
* CUDA-capable GPU (optional, but recommended)
* ffmpeg (for Whisper audio decoding)

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

```bash
# Optional configuration
export NETRAK_WHISPER_MODEL_NAME="base"  # tiny, base, small, medium, large
export NETRAK_MAX_AUDIO_SIZE_MB=25
export NETRAK_DEVICE="auto"  # auto, cuda, cpu
export NETRAK_CORS_ORIGINS="*"
```

## Running Locally

### Start the Service

```bash
cd netrak_speech_intelligence
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Swagger Documentation

Open `http://localhost:8000/docs` for interactive API documentation.

## API Usage

### Health Check

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "netrak-speech-intelligence",
  "version": "1.0.0"
}
```

### Analyze Speech

```bash
curl -X POST http://localhost:8000/speech/analyze \
  -F "file=@/path/to/audio.wav" \
  -H "Content-Type: multipart/form-data"
```

**Supported Formats:** `.wav`, `.mp3`, `.m4a`, `.flac`, `.ogg`

**Response Example:**
```json
{
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "model_version": "speech-intelligence-v1.0.0",
  "transcript": "Main CBI officer bol raha hoon...",
  "detected_language": {
    "code": "hi",
    "name": "Hindi",
    "confidence": 0.94
  },
  "ai_voice": {
    "probability": 0.81,
    "prediction": "likely_ai",
    "confidence": 0.81
  },
  "scam_keywords": [
    {"keyword": "cbi", "category": "authority"},
    {"keyword": "arrest", "category": "threat"}
  ],
  "authority_impersonation": {
    "detected": true,
    "authorities": ["CBI"],
    "confidence": 0.90
  },
  "money_request": {
    "detected": true,
    "payment_methods": ["bank_transfer"],
    "amounts": ["50000"],
    "confidence": 0.93
  },
  "risk": {
    "score": 0.95,
    "level": "CRITICAL",
    "reasons": [
      "Authority impersonation detected: CBI",
      "Money transfer request detected (amounts: 50000)",
      "Threat or arrest language detected"
    ]
  },
  "processing_time_ms": 3450
}
```

## Model Versions

| Component | Model | Version |
|-----------|-------|----------|
| Speech-to-Text | OpenAI Whisper | base (multilingual) |
| Voice Spoof Detection | wav2vec2-large-xlsr-deepfake | Gustking |
| Keyword Detection | Rule-based | v1.0 |
| Authority Detection | Pattern-based | v1.0 |
| Money Detection | Pattern-based | v1.0 |
| Risk Engine | Weighted scoring | v1.0 |

## Risk Scoring

The risk score is calculated using explainable weighted scoring:

* **Authority Impersonation:** 0.25
* **Money Request:** 0.25
* **Threat Language:** 0.15
* **Urgency Language:** 0.10
* **Digital Arrest:** 0.10
* **Secrecy Instructions:** 0.05
* **Remote Access Request:** 0.05
* **AI Voice:** 0.05

**Risk Levels:**
* `LOW`: 0.00 - 0.29
* `MEDIUM`: 0.30 - 0.59
* `HIGH`: 0.60 - 0.79
* `CRITICAL`: 0.80 - 1.00

## Testing status

No automated test suite is currently included in this directory. Only syntax compilation is part of the repository release audit; inference correctness and API behavior remain future validation work.

## Databricks Apps Deployment

### Deploy to Databricks

```bash
databricks apps deploy netrak-speech-intelligence \
  --source-code-path /Workspace/Users/your-email/netrak_speech_intelligence
```

### Check Status

```bash
databricks apps get netrak-speech-intelligence
```

## Limitations

* **Audio Length:** Maximum 10 minutes per request
* **File Size:** Maximum 25 MB
* **Language Support:** Optimized for Hindi, English, and Hinglish
* **AI Voice Detection:** Probabilistic, not forensic proof
* **Keyword Coverage:** MVP keyword set (extensible)
* **Amount Extraction:** Limited Hindi number word support

## Ethical Considerations

* **Privacy:** No audio or transcripts are logged at INFO level
* **Probabilistic:** AI voice detection is not definitive proof
* **Language Bias:** Performance may vary for non-supported languages
* **False Positives:** Contextual mentions may be flagged

## Contributing

This is a hackathon project. Contributions welcome!

## License

See project license.

## Contact

Netrak AI Services Layer
Digital Public Safety Intelligence Platform
