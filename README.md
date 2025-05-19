# Shopee Sales Dashboard

## About the Project

This project is a comprehensive sales analytics dashboard for Shopee, built using a dataset derived from Kaggle. It provides insightful visualizations and analytics tools for Shopee marketplace data, including product sales, seller performance, and category analysis.

## Project Structure

- realFrontend branch: Contains the frontend application built with Vite + React
- backend branch: Contains the API and backend services running on AWS
- _Note: The main branch is deprecated. Please use the realFrontend and backend branches for the latest code._

## Features

- 📊 Sales trend analysis with interactive charts
- 🏆 Top-performing product insights
- 👨‍💼 Seller performance tracking and comparison
- 🔍 Category-based revenue analysis
- 📱 Responsive design for desktop and mobile devices
- 🔒 Secure authentication system

## Technology Stack

- Frontend: React, Vite, TailwindCSS
- Backend: AWS Services (Lambda, API Gateway, S3)
- Charts: Chart.js with React wrapper
- Testing: Vitest, pytest
- CI/CD: GitHub Actions workflows (in their respective branches)

## Live Demo

The application is deployed and can be accessed at: https://paynet-a6a01.web.app/login

## Getting Started

Prerequisites

- Node.js (v16+)
- npm or yarn

Installation and Setup

1. Clone the repository

```bash
git clone https://github.com/kritzz/paynet.git
```

2. Switch to the realFrontend branch

```bash
git checkout realFrontend
```

3. Install dependencies

```bash
npm install
# or
yarn install
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

## Testing

Run the test suite with:

```bash
npm run test
# or
yarn test
```

## Deployment

The application is automatically deployed via GitHub Actions workflow when changes are pushed to the main branches.

## Data Source

The dashboard is built on a dataset derived from [Kaggle's Shopee marketplace data](https://www.kaggle.com/datasets/yoongsin/shopee-sample-data), which has been processed and optimized for this application.

## Acknowledgements

- [Kaggle](https://www.kaggle.com/datasets/yoongsin/shopee-sample-data) for the original dataset
- All contributors who helped build and improve this project
