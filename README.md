🛡️ Overview
PayGuard AI is a sophisticated, real-time fraud detection system designed to analyze UPI transactions using machine learning algorithms. The system provides intelligent risk assessment with multi-layered security verification to protect users from fraudulent activities.
✨ Key Features

Real-time Transaction Analysis: Instant fraud detection using ML models
Multi-factor Authentication: PIN verification with security question fallback
Risk Assessment Dashboard: Comprehensive analytics and transaction insights
Intelligent Flagging: Automated transaction blocking for high-risk activities
Historical Analysis: Detailed transaction history with risk categorization
Interactive Visualizations: Charts and graphs for transaction patterns
Responsive Design: Modern UI with mobile-first approach

🚀 Live Demo
Experience PayGuard AI in action:

Demo Users:

user123 (PIN: 1234)
user456 (PIN: 5678)



📊 System Architecture
Frontend (React + TypeScript)
    ↓
Backend API (FastAPI)
    ↓
ML Model (Logistic Regression)
    ↓
Risk Assessment Engine
🔧 Technology Stack
Frontend

React 18 with TypeScript
Tailwind CSS for styling
Lucide React for icons
Recharts for data visualization
Modern responsive design

Backend

FastAPI for high-performance API
Python 3.9+ with async support
Pydantic for data validation
CORS middleware for cross-origin requests

Machine Learning

Scikit-learn for model training
Pandas for data manipulation
NumPy for numerical operations
Logistic Regression for classification
Label Encoding for categorical variables

🛠️ Installation & Setup
Prerequisites

Node.js 16+ and npm/yarn
Python 3.9+
pip package manager

Backend Setup

Clone the repository
bashgit clone https://github.com/yourusername/payguard-ai.git
cd payguard-ai

Set up Python environment
bashcd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

Train the ML model
bashpython train_model.py

Start the FastAPI server
bashuvicorn main:app --reload --port 8000


Frontend Setup

Install dependencies
bashcd frontend
npm install

Start the development server
bashnpm start

Access the application

Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/docs



📋 API Endpoints
Authentication & Data

GET /stats - Get transaction statistics
GET /transactions - Fetch historical transactions
POST /predict - Analyze transaction risk

Request Example
json{
  "userId": "user123",
  "amount": 50000,
  "time": "14:30",
  "device": "known",
  "location": "Mumbai",
  "receiver": "unknown",
  "prev_locations": [],
  "prev_times": []
}
Response Example
json{
  "prediction": "High Risk",
  "confidence": 0.847
}
🧠 Machine Learning Model
Risk Assessment Factors

Transaction Amount: Higher amounts increase risk score
Time of Transaction: Unusual hours (before 6 AM or after 10 PM)
Device Recognition: New/unrecognized devices
Location Analysis: Transactions from new locations
Receiver Status: Unknown recipients increase risk
Historical Patterns: Based on user's transaction history

Model Performance

Algorithm: Logistic Regression with class balancing
Features: Amount, time, device, location, receiver status
Accuracy: Optimized for fraud detection with minimal false positives

📈 Features in Detail
🔐 Security Features

PIN Authentication: 4-digit secure PIN verification
Security Questions: Additional verification for high-risk transactions
Transaction Flagging: Automatic blocking of suspicious activities
Session Management: Secure user sessions with logout functionality

📊 Analytics Dashboard

Transaction Trends: Visual representation of transaction patterns
Risk Distribution: Pie charts showing safe vs. risky transactions
Amount Distribution: Bar charts for transaction amount ranges
Real-time Statistics: Live updates of transaction metrics

🎯 User Experience

Intuitive Interface: Clean, modern design with smooth transitions
Responsive Layout: Optimized for desktop and mobile devices
Real-time Feedback: Instant transaction analysis results
Interactive Elements: Hover effects and smooth animations

🔒 Security Considerations

Data Privacy: No sensitive data stored persistently
Secure Authentication: Multi-factor authentication system
Transaction Monitoring: Continuous monitoring for suspicious activities
Risk Mitigation: Automated blocking of high-risk transactions

🚧 Development Roadmap
Phase 1 (Current)

 Basic fraud detection
 Real-time analysis
 User authentication
 Analytics dashboard

Phase 2 (Planned)

 Advanced ML models (Random Forest, XGBoost)
 Real-time notifications
 Mobile app development
 Advanced analytics

Phase 3 (Future)

 AI-powered insights
 Behavioral biometrics
 Blockchain integration
 Multi-bank support

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository
Create a feature branch: git checkout -b feature/AmazingFeature
Commit your changes: git commit -m 'Add some AmazingFeature'
Push to the branch: git push origin feature/AmazingFeature
Open a Pull Request

Development Guidelines

Follow TypeScript best practices
Write clean, documented code
Add tests for new features
Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

Live demo initial phase - https://claude.ai/public/artifacts/87209036-90b2-4582-8059-49c7897bd500 
Clone and start for end to end chart enabled experience 
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/57e45550-5dba-4aae-8c9d-94ffcf22ea24" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/883849a6-8ae8-4c77-8255-7db47d43066c" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b4b392e3-66a6-4440-8081-4b80de9b50e0" />



