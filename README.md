# Career Toolkit

Career Toolkit is a microservices-based web application designed to simplify the job application process. It features individual services for managing users, building resumes, and generating tailored cover letters. The app integrates AI suggestions and follows Clean Architecture principles to ensure scalability and maintainability.

## ✨ Features

- 🧩 **Modular Microservices**: Separate services for **User Management**, **Resume Builder**, **Cover Letter Builder**, and **AI Service**.
- 🤖 **AI Integration**: Uses **Gemini AI** to provide smart suggestions for resume and cover letter improvements  
- 📐 **Clean Architecture**: Applied to each .NET microservice for a clear separation of concerns and maintainability  
- 🌐 **Angular Frontend**: Fully responsive frontend that communicates with all services via a centralized API Gateway  
- 🐳 **Dockerized**: All services are containerized  
- 🚀 **CI/CD Automation**: Uses **GitHub Actions** for building, testing, and deploying the application  
- ☁️ **Azure Deployment**: Deployed using **Azure Container Apps** and **Azure Static Web Apps**  
- 🗃️ **PostgreSQL**: Reliable, high-performance relational database used across services

## 🧱 Tech Stack

- **Frontend**: Angular  
- **Backend**: .NET (C#) Microservices using Clean Architecture  
- **Database**: PostgreSQL  
- **AI Assistant**: Gemini API (for resume and cover letter suggestions)  
- **CI/CD**: GitHub Actions  
- **Containerization**: Docker  
- **Orchestration**: Kubernetes  
- **Cloud Provider**: Microsoft Azure

## 🛠️ Architecture Overview
Frontend (Angular)
│
API Gateway
┌───┴───┬────────┬─────────┬
User Resume CoverLetter AIService
  │     │        │         │
     PostgreSQL         Gemini AI 
