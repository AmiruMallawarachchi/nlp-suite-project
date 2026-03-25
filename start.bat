@echo off
echo Starting Multi-Task NLP Intelligence Suite...
echo Docs available at: http://127.0.0.1:8000/docs

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pause