# NorthStar Risk Intake System

A web-based Governance, Risk, and Compliance (GRC) platform developed for the CYBR 1201 CISO Challenge at Vancouver Community College.

## Overview

The NorthStar Risk Intake System serves as the primary risk intake and management platform for NorthStar Financial Services Ltd. The application allows employees and managers to identify, submit, track, and monitor organizational risks through a structured and repeatable process.

Built using Next.js and deployed on Vercel, the platform automates the collection of risk information and integrates directly with Google Sheets through the Google Sheets API, creating a centralized risk register that supports ongoing risk assessment, treatment, monitoring, and reporting activities.

The objective of the project is to transform risk management from a static spreadsheet exercise into a scalable and auditable enterprise process that aligns with modern Governance, Risk, and Compliance (GRC) practices.

---

## Key Features

### Risk Intake Portal

The application provides a structured risk submission workflow that captures:

* Submitter information
* Department
* Asset affected
* Asset type
* Risk category
* Threat description
* Vulnerability
* Likelihood rating and justification
* Impact rating and justification
* Supporting evidence
* Escalation contacts

### Automated Risk Register Integration

Submitted risks are automatically synchronized to a centralized Google Sheets risk register using the Google Sheets API.

Each submission generates and maintains:

* Risk ID
* Timestamps
* Risk score calculations
* Severity classifications
* Risk ownership assignments
* Treatment tracking
* Review scheduling
* Residual risk monitoring

### Governance & Reporting Capabilities

The system supports:

* Automated risk scoring
* Severity classification (Low, Medium, High, Critical)
* Risk ownership assignment
* Treatment status tracking
* Residual risk calculations
* Control effectiveness monitoring
* Risk velocity tracking
* Review and reporting workflows

---

## Technology Stack

### Front-End

* Next.js
* React
* TypeScript
* Tailwind CSS

### Hosting & Deployment

* Vercel

### Data & Automation

* Google Sheets API
* Automated form-to-register synchronization

---

## System Workflow

1. Employee identifies a potential risk.
2. Risk is submitted through the NorthStar Risk Intake System.
3. Submission data is validated and processed.
4. Risk information is automatically written to the risk register.
5. Risk scores and severity levels are calculated.
6. Risk owners review and assess the submission.
7. Treatment actions are assigned and monitored.
8. Risks are reviewed, updated, and reported through dashboards and reporting processes.

---

## Getting Started

First, run the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

or

```bash
bun dev
```

Open http://localhost:3000 in your browser to view the application.

---

## Development

The application uses the Next.js App Router architecture.

To begin development:

1. Clone the repository.
2. Install dependencies.
3. Configure environment variables.
4. Run the development server.
5. Modify files within the `app/` directory.

Changes automatically reload during development.

---

## Deployment

The application is deployed using Vercel.

To deploy:

1. Push changes to GitHub.
2. Connect the repository to Vercel.
3. Configure environment variables.
4. Deploy automatically through the Vercel platform.

---

## Educational Context

This project was developed as part of the CYBR 1201 Introduction to Security Program Management course at Vancouver Community College.

The application supports the Week 4 "CISO Challenge" by providing a practical implementation of a risk intake and risk management process for NorthStar Financial Services Ltd.
