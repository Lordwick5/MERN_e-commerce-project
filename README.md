# MERN E-Commerce

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register/login) with JWT
- Product catalog with detail pages
- Shopping cart with persistent state
- Checkout flow with Stripe payment integration
- Order history and confirmation
- Admin dashboard for managing products
- Protected routes for authenticated users

## Tech Stack

**Frontend:** React, Vite, React Router
**Backend:** Node.js, Express, MongoDB (Mongoose), Stripe
**Auth:** JWT-based authentication

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB instance)
- Stripe account for payment testing

### Backend Setup

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

Create a \`.env\` file in the backend folder with:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
\`\`\`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Project Structure

\`\`\`
mern-ecommerce/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── seed.js
│ └── server.js
└── frontend/
├── public/
└── src/
├── components/
├── context/
└── pages/
\`\`\`

## License

This project is for educational purposes.
