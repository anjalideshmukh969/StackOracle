# StockOracle 📈🤖

StockOracle is an AI-powered stock market forecasting platform that combines the MERN Stack with Deep Learning techniques to provide stock price predictions, portfolio analysis, watchlist management, and AI-generated investment insights.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Dashboard

* Portfolio Overview
* Profit & Loss Tracking
* Watchlist Management
* Market Overview
* AI Insights

### Stock Prediction

* Historical Stock Data Visualization
* Deep Learning-Based Forecasting
* Buy / Hold / Sell Recommendations
* Prediction Confidence Scores

### Portfolio Management

* Add Holdings
* Track Investments
* Monitor Performance
* View Unrealized Profit & Loss

### Watchlist

* Add Stocks
* Remove Stocks
* Track AI Signals

### Market Analytics

* Top Gainers
* Top Losers
* Sector Performance
* Market News

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts
* Axios

<!-- ### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt -->

### AI Service

* Python
* FastAPI
* TensorFlow / Keras
* LSTM Neural Networks
* Scikit-Learn
* Pandas
* NumPy
* Yahoo Finance API

---

## Project Structure

StockOracle/

├── frontend/

├── backend/

├── ai-service/

└── README.md

---

## Installation

### Clone Repository

git clone https://github.com/anjalideshmukh969/StockOracle.git

cd StockOracle

---

### Frontend Setup

cd frontend

npm install

npm run dev

---

### Backend Setup

cd backend

npm install

npm run dev

---

<!-- ### AI Service Setup

cd ai-service

pip install -r requirements.txt

uvicorn app:app --reload -->

---

## Environment Variables

### Backend (.env)

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

AI_SERVICE_URL=http://localhost:8000

---

<!-- ### AI Service (.env)

MODEL_PATH=models/lstm_model.h5

SCALER_PATH=models/scaler.pkl

---

## API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

### Portfolio

GET /api/portfolio

POST /api/portfolio

DELETE /api/portfolio/:id

### Watchlist

GET /api/watchlist

POST /api/watchlist

DELETE /api/watchlist/:symbol

### Prediction

GET /api/stocks/predict/:symbol

GET /api/stocks/history/:symbol

---

## Deep Learning Model

The project uses an LSTM (Long Short-Term Memory) neural network to forecast future stock prices.

Input Features:

* Open Price
* Close Price
* High Price
* Low Price
* Volume

Outputs:

* Next Day Prediction
* Future Trend Forecast
* Confidence Score

---

## Future Enhancements

* Real-time Stock Updates
* Sentiment Analysis
* Candlestick Charts
* News-Based Predictions
* Email Alerts
* AI Chat Assistant

--- -->

## Author

Anjali Deshmukh
