# TurboFinder

An app to find out about your vehicle's fuel emissions.

# TurboFinder - Django Server with React Frontend

TurboFinder is a web application template that combines the power of Django as a backend framework and React as a frontend library. This template serves as a foundation for building dynamic and modern web applications.

## Installation

Follow these steps to set up the TurboFinder application:

### 1. Clone the Repository

```bash
https://github.com/shgnplaatjies/turbo-finder.git
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

#### Environment Configuration

- Create a copy of the `.env.example` file in the `backend` and `frontend` directories and rename it `.env`.
- Update the configuration variables in the `.env` file as needed.

### 5. Database Migration

#### Set up your MySQL database

- After installing MySQL, create a database and database user.
- Configure the database environment variables.
- The following scripts will automatically create the necessary tables and data

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

#### Swagger UI Documenation

- Open your web browser and navigate to [http://localhost:8000](http://localhost:8000) to access TurboFinder Swagger UI docs.

#### Admin Dashboard

- Open your web browser and navigate to [http://localhost:8000/admin](http://localhost:8000/admin) to access TurboFinder Admin, powered by Django.

#### Live React Application

- Open your web browser and navigate to [http://localhost:8000/react](http://localhost:8000/react) to access TurboFinder Admin, powered by Django.

#### React Development Server

- Start the development server with `npm run start`
- Open your web browser and navigate to [http://localhost:5173](http://localhost:5173) to access TurboFinder Admin, powered by Django.

## Folder Structure

- `backend`: Contains Django backend files.
- `frontend`: Contains React frontend files.
- `docs`: Documentation files.

# Project Summary

## Objective

- Successfully developed a user-friendly platform for comprehensive insights into Toyota vehicle carbon emissions.
- Enabled users to effortlessly access emissions data for specific models and years.

## Backend Implementation

### Django Framework

- Utilized Django for efficient data processing, seamless API integration, and robust user authentication.

### Carbon Emission API Integration

- Successfully integrated with a Carbon Emission calculator API.
- Implemented caching to optimize performance and adhered to the 200 API call limit.

### User Authentication & Security

- Implemented secure user authentication with a forgot password feature.
- Ensured API endpoint security and safeguarded sensitive user data.

### Models and Database Design

- Designed efficient models using Django ORM for seamless storage of vehicle emissions data and user information.
- Utilized Django ORM for calculating averages, ensuring data integrity.

### API Security

- Successfully secured the API using tokens, providing robust protection against unauthorized access.

## Frontend Implementation

### Framework Choice

- Developed the frontend using React, offering a modern and reactive user interface.

### Dynamic UI Elements

- Implemented dynamic dropdowns for model and year filtering.
- Enabled users to dynamically change emission units (e.g., grams, kg, pounds) for enhanced customization.

### Login Page

- Created a simple, secure login page with a password reset option, ensuring a smooth authentication process.
- Utilized Django's secure built-in access management systems.

### Dashboard

- Designed and implemented a dashboard post-login, featuring dropdowns for selecting Toyota models and years.

### Results Display

- Effectively displayed emissions data on the dashboard for selected criteria.
- Provided options for users to change displayed units, enhancing customization.

### User Profile

- Included a dedicated section for user profile access and management.
- Allowed users to personalize their experience and manage account details effortlessly.

## Conclusion

- Successfully integrated Django and React.js to deliver integration with carbon emissions insights API.
- Prioritized security, user experience, and customization to ensure users can confidently access and tailor emissions data for Toyota vehicles with ease.
