# API Documentation

This document provides detailed information about the RESTful APIs exposed by the Blood Bank Donation and Request System backend.

## Base URL
`http://localhost:5000/api/v1` (for local development)

## Authentication
All protected endpoints require a JSON Web Token (JWT) passed in the `Authorization` header as a Bearer token.

`Authorization: Bearer <your_jwt_token>`

### 1. Auth Endpoints

#### `POST /auth/register` - Register a new user

- **Description**: Allows new users (donors, hospitals, or admins) to register an account.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string (email format)",
    "password": "string (min 6 characters)",
    "role": "string (optional, default: 'donor', enum: ['admin', 'donor', 'hospital'])"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "success": false,
    "error": "User already exists"
  }
  ```

#### `POST /auth/login` - Authenticate user and get token

- **Description**: Authenticates a user with email and password, returning a JWT.
- **Request Body**:
  ```json
  {
    "email": "string (email format)",
    "password": "string"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "error": "Invalid credentials"
  }
  ```

#### `GET /auth/me` - Get current authenticated user details

- **Description**: Retrieves the profile of the currently authenticated user.
- **Authentication**: Required (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```
- **Error Response (401 Unauthorized)**:
  ```json
  {
    "success": false,
    "error": "Not authorized, token failed" 
  }
  ```

### 2. Inventory Endpoints

#### `GET /inventory` - Get blood inventory levels

- **Description**: Retrieves the current stock levels for all blood types.
- **Authentication**: Optional (can be public or protected based on configuration)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": "number",
    "data": [
      {
        "id": "number",
        "blood_type": "string",
        "quantity": "number",
        "last_updated": "timestamp"
      }
    ]
  }
  ```

#### `PUT /inventory` - Update blood inventory

- **Description**: Adds or subtracts quantity from a specific blood type in the inventory.
- **Authentication**: Required (Admin role)
- **Request Body**:
  ```json
  {
    "blood_type": "string (e.g., 'A+', 'O-')",
    "quantity": "number (positive integer)",
    "action": "string (enum: ['add', 'subtract'])"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "blood_type": "string",
      "quantity": "number",
      "last_updated": "timestamp"
    }
  }
  ```
- **Error Response (403 Forbidden)**:
  ```json
  {
    "success": false,
    "error": "User role admin is not authorized to access this route"
  }
  ```

### 3. Request Endpoints

#### `POST /requests` - Create a new blood request

- **Description**: Allows hospitals or admins to create a new emergency blood request.
- **Authentication**: Required (Hospital or Admin role)
- **Request Body**:
  ```json
  {
    "blood_type": "string (e.g., 'A+', 'O-')",
    "quantity": "number (positive integer)",
    "reason": "string",
    "hospital_id": "number",
    "urgency": "string (optional, default: 'normal', enum: ['normal', 'urgent', 'emergency'])"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "hospital_id": "number",
      "blood_type": "string",
      "quantity": "number",
      "reason": "string",
      "urgency": "string",
      "status": "string",
      "created_at": "timestamp"
    }
  }
  ```

#### `GET /requests` - Get all blood requests

- **Description**: Retrieves a list of all blood requests.
- **Authentication**: Required (Admin role)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": "number",
    "data": [
      {
        "id": "number",
        "hospital_id": "number",
        "hospital_name": "string",
        "blood_type": "string",
        "quantity": "number",
        "reason": "string",
        "urgency": "string",
        "status": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ]
  }
  ```

#### `PATCH /requests/:id` - Update blood request status

- **Description**: Updates the status of a specific blood request.
- **Authentication**: Required (Admin role)
- **URL Parameters**:
  - `id`: The ID of the request to update.
- **Request Body**:
  ```json
  {
    "status": "string (enum: ['pending', 'approved', 'rejected', 'in-transit', 'completed'])"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "number",
      "hospital_id": "number",
      "blood_type": "string",
      "quantity": "number",
      "reason": "string",
      "urgency": "string",
      "status": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "success": false,
    "error": "Request not found"
  }
  ```
