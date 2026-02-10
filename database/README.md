# Database Schema Documentation

This directory contains the JSON schema definitions for the LMS project.

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Assignment : "creates (Faculty)"
    User ||--o{ Submission : "submits (Student)"
    Assignment ||--o{ Submission : "has"

    User {
        ObjectId _id PK
        string name
        string email
        string password
        string role "STUDENT | FACULTY"
        datetime createdAt
    }

    Assignment {
        ObjectId _id PK
        string title
        string description
        string courseCode
        datetime dueDate
        ObjectId facultyId FK
        datetime createdAt
    }

    Submission {
        ObjectId _id PK
        ObjectId assignmentId FK
        ObjectId studentId FK
        string filePath
        number plagiarismScore
        number grade
        string feedback
        string status "ON_TIME | LATE"
        datetime submittedAt
        datetime gradedAt
    }
```

## Collections

### 1. User
Stores authentication and profile information for both Students and Faculty.
- **role**: Determines access level (RBAC).

### 2. Assignment
Created by Faculty to track coursework.
- **facultyId**: Links to the creator.

### 3. Submission
Created by Students when uploading work.
- **assignmentId**: Links to the specific assignment.
- **studentId**: Links to the student.
- **plagiarismScore**: Mock score generated upon submission.
