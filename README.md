# GiftWise — Full-Stack Portfolio Project

GiftWise is a full-stack web application built to showcase practical product development skills across React, Node.js, REST APIs, authentication, database modeling, and third-party media storage. It solves a familiar coordination problem: friends can share event wishlists and privately pledge gifts to avoid duplicate purchases.

## What this project demonstrates

- Designing and building a complete client/server application
- Creating a responsive React single-page app with protected routes
- Building a RESTful Express API with clear resource boundaries
- Implementing secure authentication with hashed passwords and JWTs
- Modeling relationships in MongoDB with Mongoose (users, friends, events, gifts, and requests)
- Applying authorization rules for event ownership and gift pledging
- Handling multipart file uploads and integrating Cloudinary storage
- Managing client-side API requests, authentication state, and error handling

## Features

- Account registration and JWT-based sign-in
- Create, edit, and delete personal events
- Send, accept, and reject friend requests by email
- Browse events created by friends
- Add, update, and delete gifts for an event
- Upload gift images to Cloudinary
- Pledge or unpledge a gift on a friend's event
- One pledged gift per person per event to help prevent duplicates

## Tech stack

- **Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt
- **Uploads:** Multer and Cloudinary

## Core product flows

1. A user creates an account and signs in.
2. They invite friends using an email address; recipients can accept or reject requests.
3. They create an event and add gifts to its wishlist, optionally with images.
4. Friends view shared events and pledge one gift per event, preventing duplicate purchases while keeping the pledge separate from the event owner.

## Project structure

```text
GiftWise/
├── frontend/     # React single-page application
└── Backend/      # Express REST API
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account for gift-image uploads

### 1. Configure the backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start the API:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 2. Configure the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `Backend` | `npm run dev` | Start the API with Nodemon |
| `Backend` | `npm start` | Start the API with Node.js |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production build |
| `frontend` | `npm run lint` | Run ESLint |

## API overview

All routes except registration and sign-in require an `Authorization: Bearer <token>` header.

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Friends | `POST /api/friends/invite`, `GET /api/friends/requests`, `POST /api/friends/accept/:requestId`, `POST /api/friends/reject/:requestId` |
| Events | `POST /api/events`, `GET /api/events`, `GET /api/events/feed`, `GET /api/events/:id`, `PUT /api/events/:id`, `DELETE /api/events/:id` |
| Gifts | `POST /api/gifts`, `GET /api/gifts/event/:eventId`, `PUT /api/gifts/:id`, `DELETE /api/gifts/:id`, `POST /api/gifts/:giftId/pledge`, `POST /api/gifts/:giftId/unpledge` |

Gift creation and updates accept `multipart/form-data`; send the image under the `image` field.

## Notes

- Do not commit `.env` files or Cloudinary credentials.
- CORS is currently enabled for all origins. Restrict it to your deployed frontend URL before production deployment.

## License

This project is currently unlicensed.
