# AI-Enabled Learning Platform for Competency Gap Analysis & Quiz Generation

> **Smart India Hackathon (SIH) Backend MVP**  
> Built with **Java 17+**, **Spring Boot 3.x**, **Spring Data JPA**, **H2 Database**, and **Spring AI**.

---

## 🚀 Overview

The **AI-Enabled Learning Platform** provides an intelligent, automated backend designed for capacity building, civil services competency evaluation, and dynamic assessment generation.

### Key Capabilities:
1. **Competency Gap Analysis (`/api/gaps`)**: Compares an employee's currently mastered skills against organizational role benchmarks to identify exact deficiencies.
2. **Targeted iGOT Karmayogi Course Recommendations (`/api/training`)**: Suggests relevant training courses from the Government of India's **iGOT Karmayogi** portal for each identified skill gap.
3. **AI-Powered Quiz Generation (`/api/quiz`)**: Integrates **Spring AI** (`ChatClient`) with Large Language Models (OpenAI GPT-4o-mini / generic LLMs) to dynamically extract and synthesize 3-question multiple-choice quizzes from raw administrative text or training documents.

---

## 🛠 Tech Stack

- **Language**: Java 17+ (supports Java 21 / 26)
- **Framework**: Spring Boot 3.3.4 (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`)
- **AI Integration**: Spring AI 1.0.0-M1 (`spring-ai-openai-spring-boot-starter`)
- **Database**: H2 In-Memory Database (zero-config startup; easily swappable with PostgreSQL/MySQL)
- **Boilerplate Reduction**: Project Lombok
- **JSON Processing**: Jackson Databind & JSR-310
- **Build Tool**: Apache Maven

---

## 🏛 3-Tier Enterprise Architecture

```
com.sih.learningplatform/
├── config/               # Spring AI ChatClient Bean configuration
│   └── AiConfig.java
├── controller/           # REST Presentation Layer
│   ├── CompetencyGapController.java
│   ├── TrainingRecommendationController.java
│   └── QuizController.java
├── dto/                  # Request/Response Data Transfer Objects
│   ├── ApiResponse.java
│   ├── CourseRecommendation.java
│   ├── GapAnalysisResponse.java
│   ├── QuestionDto.java
│   ├── QuizGenerateRequest.java
│   ├── QuizResponse.java
│   └── TrainingRecommendationResponse.java
├── entity/               # JPA Domain Models
│   ├── Employee.java
│   ├── LearningMaterial.java
│   ├── Question.java
│   ├── Quiz.java
│   └── RoleCompetency.java
├── exception/            # Centralized Exception Handling & RFC-7807 responses
│   ├── AiServiceException.java
│   ├── ErrorResponse.java
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── init/                 # Auto-seeding of benchmark competencies & employees
│   └── DataInitializer.java
├── repository/           # Spring Data JPA Repositories
│   ├── EmployeeRepository.java
│   ├── LearningMaterialRepository.java
│   ├── QuestionRepository.java
│   ├── QuizRepository.java
│   └── RoleCompetencyRepository.java
└── service/              # Core Business Logic
    ├── CompetencyService.java
    ├── QuizGenerationService.java
    └── TrainingRecommendationService.java
```

---

## 💾 Pre-Seeded Demonstration Data

On startup, `DataInitializer` populates the in-memory H2 database with demo records:

| Employee ID | Name | Designation | Current Skills | Target Role Benchmarks |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Rajesh Kumar | Assistant Section Officer | `e-Office Administration` | `e-Office Administration`, `RTI Act & Governance`, `Public Financial Management`, `Procurement & GeM` |
| **2** | Priya Sharma | Section Officer | `e-Office Administration`, `Procurement & GeM`, `Citizen Grievance Redressal` | `e-Office Administration`, `Public Financial Management`, `Procurement & GeM`, `Citizen Grievance Redressal`, `Project Management` |
| **3** | Amit Verma | Data Analyst | `Data Analytics in Governance` | `Data Analytics in Governance`, `Cybersecurity & Data Privacy`, `Project Management` |

---

## ⚙️ Configuration & Running

### 1. Configure OpenAI API Key (Optional for Dev/Demo)
To use real OpenAI GPT-4o-mini generation, set your environment variable:
```bash
# Windows PowerShell:
$env:OPENAI_API_KEY="sk-proj-your-actual-key"

# Linux / macOS:
export OPENAI_API_KEY="sk-proj-your-actual-key"
```
> **Note**: If no key is set or `mock-openai-key-for-development` is used, the platform runs in **resilient mock mode**, returning context-aware generated MCQs so you can test all workflows locally without paid API access.

### 2. Run the Application
Open the project in any modern Java IDE (IntelliJ IDEA, VS Code, Eclipse) and run `LearningPlatformApplication.java`, or via Maven:
```bash
mvn spring-boot:run
```

### 3. Access H2 Database Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:sih_learning_db`
- Username: `sa`
- Password: `password`

---

## 📡 REST API Reference & cURL Examples

### 1. Competency Gap Analysis
- **Endpoint**: `POST /api/gaps/analyze/{employeeId}`
- **Description**: Compares the employee's current skills against their designation's benchmark skills.
- **cURL Request**:
```bash
curl -X POST http://localhost:8080/api/gaps/analyze/1
```
- **Sample JSON Response**:
```json
{
  "success": true,
  "message": "Competency gap analysis completed successfully",
  "data": {
    "employeeId": 1,
    "employeeName": "Rajesh Kumar",
    "designation": "Assistant Section Officer",
    "currentSkills": [
      "e-Office Administration"
    ],
    "requiredSkills": [
      "e-Office Administration",
      "RTI Act & Governance",
      "Public Financial Management",
      "Procurement & GeM"
    ],
    "missingSkills": [
      "RTI Act & Governance",
      "Public Financial Management",
      "Procurement & GeM"
    ],
    "competencyMatchPercentage": 25.0
  },
  "timestamp": "2026-09-09T01:55:00"
}
```

---

### 2. Mock iGOT Course Recommendations
- **Endpoint**: `GET /api/training/recommend/{employeeId}`
- **Description**: Recommends targeted iGOT Karmayogi courses to bridge the missing competencies.
- **cURL Request**:
```bash
curl -X GET http://localhost:8080/api/training/recommend/1
```
- **Sample JSON Response**:
```json
{
  "success": true,
  "message": "iGOT Karmayogi training recommendations retrieved successfully",
  "data": {
    "employeeId": 1,
    "employeeName": "Rajesh Kumar",
    "designation": "Assistant Section Officer",
    "missingSkillsCount": 3,
    "missingSkills": [
      "RTI Act & Governance",
      "Public Financial Management",
      "Procurement & GeM"
    ],
    "recommendedCourses": [
      {
        "title": "Right to Information (RTI) Act & Transparent Governance",
        "url": "https://igotkarmayogi.gov.in/courses/rti-governance-101",
        "skillTargeted": "RTI Act & Governance",
        "provider": "iGOT Karmayogi (DoPT, GoI)",
        "estimatedDuration": "3 Hours"
      },
      {
        "title": "Comprehensive Public Financial Management & GFR 2017",
        "url": "https://igotkarmayogi.gov.in/courses/pfm-gfr-2017",
        "skillTargeted": "Public Financial Management",
        "provider": "iGOT Karmayogi (DoPT, GoI)",
        "estimatedDuration": "8 Hours"
      },
      {
        "title": "Government e-Marketplace (GeM) Procurement Guidelines",
        "url": "https://igotkarmayogi.gov.in/courses/gem-procurement-301",
        "skillTargeted": "Procurement & GeM",
        "provider": "iGOT Karmayogi (DoPT, GoI)",
        "estimatedDuration": "5 Hours"
      }
    ]
  },
  "timestamp": "2026-09-09T01:55:10"
}
```

---

### 3. AI Quiz Generation
- **Endpoint**: `POST /api/quiz/generate`
- **Description**: Generates 3 multiple-choice questions from raw text using Spring AI `ChatClient`, saves the quiz and questions to H2, and returns the entity.
- **cURL Request**:
```bash
curl -X POST http://localhost:8080/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "General Financial Rules 2017 - Procurement Principles",
    "documentText": "Rule 144 of the General Financial Rules (GFR) 2017 lays down fundamental principles of public buying. Every authority delegated with the financial powers of procuring goods in public interest shall have the responsibility and accountability to bring efficiency, economy, and transparency in matters relating to public procurement and for fair and equitable treatment of suppliers and promotion of competition in public procurement. The description of the subject matter of procurement to the extent practicable should be objective, functional, and not refer to a particular trademark, trade name or brand."
  }'
```
- **Sample JSON Response**:
```json
{
  "success": true,
  "message": "AI Quiz generated and persisted successfully",
  "data": {
    "quizId": 1,
    "materialId": 1,
    "materialTitle": "General Financial Rules 2017 - Procurement Principles",
    "totalQuestions": 3,
    "questions": [
      {
        "id": 1,
        "questionText": "Under Rule 144 of GFR 2017, which core principles must authorities ensure in public procurement?",
        "optionA": "Speed and informal selection of familiar vendors",
        "optionB": "Efficiency, economy, transparency, and fair competition",
        "optionC": "Single-source procurement without justification",
        "optionD": "Mandatory selection of highest price bidders",
        "correctAnswer": "optionB"
      },
      {
        "id": 2,
        "questionText": "How should the description of the subject matter of procurement be specified under GFR 2017?",
        "optionA": "By naming specific proprietary brand names",
        "optionB": "In an objective and functional manner without trademark bias",
        "optionC": "Using subjective parameters determined by the vendor",
        "optionD": "Restricting specifications to imported foreign models only",
        "correctAnswer": "optionB"
      },
      {
        "id": 3,
        "questionText": "What is the primary responsibility of an authority delegated with financial procurement powers?",
        "optionA": "Promoting fair and equitable treatment of suppliers and public accountability",
        "optionB": "Bypassing formal tender committees",
        "optionC": "Exempting procurement records from audit reviews",
        "optionD": "Awarding tenders strictly based on seniority of officers",
        "correctAnswer": "optionA"
      }
    ],
    "createdAt": "2026-09-09T01:55:20"
  },
  "timestamp": "2026-09-09T01:55:20"
}
```

---

### 4. Fetch Quiz by ID
- **Endpoint**: `GET /api/quiz/{id}`
- **cURL Request**:
```bash
curl -X GET http://localhost:8080/api/quiz/1
```

---

## 🧪 Testing

Run unit tests via Maven:
```bash
mvn test
```
The test suite in `src/test/java/com/sih/learningplatform/CompetencyServiceTest.java` validates:
- Skill normalization and case-insensitive matching.
- Gap calculation accuracy and percentage scoring.
- Exception handling when employees or roles are not found.
- iGOT Karmayogi catalog recommendation mapping.
