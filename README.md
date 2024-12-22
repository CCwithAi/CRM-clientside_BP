# YouTube Transcript Grabber

A React application with a Python backend that fetches transcripts from YouTube videos using the youtube-transcript-api.

## Features
- Input any YouTube video URL
- Get the complete transcript of the video
- Supports both manual and auto-generated transcripts
- Error handling for invalid URLs or unavailable transcripts

## Tech Stack
- Frontend: React + Vite
- Backend: Python Flask
- API: youtube-transcript-api

## Setup

### Backend Setup
1. Install Python dependencies:
```bash
pip install flask flask-cors youtube-transcript-api
```

2. Start the backend server:
```bash
python server.py
```
The backend will run on http://localhost:5000

### Frontend Setup
1. Install Node dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```
The frontend will run on http://localhost:5179

## Usage
1. Enter a YouTube video URL in the input field
2. Click "Get Transcript"
3. The transcript will appear in the text area below
4. If there's any error, it will be displayed on the screen

## Error Handling
The application handles various error cases:
- Invalid YouTube URLs
- Videos without available transcripts
- Network errors
- API errors