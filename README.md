# TurboFinder - Django Server with React Frontend

TurboFinder combines Django as a backend framework and React as a frontend library to build dynamic web applications efficiently.

## Installation

Follow these steps to set up TurboFinder:

### 1. Clone the Repository

```bash
git clone https://github.com/shgnplaatjies/turbo-finder.git
```

### 2. Navigate to the Project Folder (backend)

```bash
cd turbofinder/backend/
python -m venv turbofinder  # Create a virtual environment
source turbofinder/bin/activate  # Activate the virtual environment (Linux or MacOS)
turbofinder/Scripts/activate  # Activate the virtual environment (Windows)
pip install -r requirements.txt # Install dependencies
cd turbofinder
python manage.py createsuperuser # Create a super user by following the prompts
python manage.py runserver
```

### 3. Install Frontend Dependencies

```bash
cd frontend/turbofinder
npm install
npm run dev
```

### 4. Configure the Environment

- Create a copy of the `.env.example` file in the `backend` and `frontend` directories and rename it `.env`.
- Update the configuration variables in the `.env` file as needed.

### 5. Database Migration

- After installing MySQL, create a database and database user.
- Configure the database environment variables.
- Run the following scripts:

```bash
python manage.py createmigrations
python manage.py migrate
```

### 7. Start the Development Servers

#### Backend

```bash
python manage.py runserver
```

#### Frontend

```bash
cd frontend/turbofinder
npm run start
```

### 8. Access TurboFinder

#### Swagger UI Documentation

- Access TurboFinder Swagger UI docs at [http://localhost:8000](http://localhost:8000).

#### Admin Dashboard

- Access TurboFinder Admin at [http://localhost:8000/admin](http://localhost:8000/admin).

#### Live React Application

- Access TurboFinder React App at [http://localhost:8000/react](http://localhost:8000/react).

#### React Development Server

- Start the development server with `npm run start`.
- Access TurboFinder React App at [http://localhost:5173](http://localhost:5173).

## Folder Structure

- `backend`: Django backend files.
- `frontend`: React frontend files.
- `docs`: Documentation files.

# Project Summary

## Objective

TurboFinder provides a platform for comprehensive insights into Toyota vehicle carbon emissions, enabling users to access emissions data effortlessly.

## Backend Implementation

### Django Framework

TurboFinder utilizes Django for data processing, API integration, and user authentication.

### Carbon Emission API Integration

Successfully integrates with a Carbon Emission calculator API and implements caching for performance optimization.

### User Authentication & Security

Implements secure user authentication and ensures API endpoint security.

### Models and Database Design

Efficient models using Django ORM facilitate seamless storage of vehicle emissions data.

### API Security

Secures the API using tokens for protection against unauthorized access.

## Frontend Implementation

### Framework Choice

Developed the frontend using React for a modern user interface.

### Dynamic UI Elements

Implements dynamic dropdowns for enhanced user interaction.

### Login Page

Creates a secure login page with a password reset option for a smooth authentication process.

### Dashboard

Features dropdowns for selecting Toyota models and years, providing users a comprehensive view of emissions data.

### Results Display

Effectively displays emissions data on the dashboard with customizable units.

### User Profile

Includes a section for user profile access and management.

## Conclusion

Successfully integrates Django and React.js to deliver carbon emissions insights. Prioritizes security, user experience, and customization for confident access to emissions data.

## Technologies Used

- TypeScript React
- Python Django with Django ORM
- Django Identity Management and Robust Security
- Rate Limiting and User Authentication
- Frontend Packages Installed Statically on Django Backend Servers to Eliminate Network Latency.
