# ChatClient

A React and TypeScript single-page client for ChatService, a real-time chat backend (the `ChatService` repo). Users register and log in, create or join password-protected rooms, and chat live over a SignalR connection, with typing indicators and message history loaded from the REST API.

## Tech stack

- React 18, TypeScript, Vite 6
- React Router 7
- Axios for REST calls
- `@microsoft/signalr` for the chat hub
- `jwt-decode` to read user claims from the access token
- ESLint

## Structure

```
src/
  api/          axios client and calls for auth, rooms and conversations
  components/   Auth, Chat, Rooms, Navigation, ProtectedRoute
  contexts/     AuthContext (token kept in localStorage, claims decoded from the JWT)
  App.tsx       routes
```

Routes: `/login`, `/register`, and the protected `/select-room`, `/create-room`, `/join-room` and `/chat-room/:roomId`.

## Prerequisites

- Node.js and npm
- A running ChatService instance (see its README)

## Running locally

```bash
npm install
npm run dev       # Vite dev server, http://localhost:5173
npm run build     # type-check and production build
npm run lint
npm run preview   # serve the production build
```

## Configuration

The backend addresses are hardcoded, not read from environment variables:

- REST base URL `http://localhost:5223/api` in `src/api/apiClient.ts`
- SignalR hub `http://localhost:5223/chat` in `src/components/Chat/ChatRoom.tsx`

Edit those two places to point at a different backend. ChatService's CORS policy allows only `http://localhost:5173`, so keep the dev server on that port.

## How it talks to ChatService

- Auth: `POST /users/register` and `POST /users/login`; the returned token is stored in `localStorage` and sent as a bearer header on every request.
- Rooms: `POST /rooms`, `GET /rooms/{id}`, `PUT /rooms` (join).
- Conversations: `POST /conversations` and paged `GET /conversations/{roomId}` for message history.
- Chat hub: invokes `JoinSpecificChatRoom`, `SendMessage` and `Typing`, and listens for `ReceiveMessage` and `UserTyping`.

Any change to an API call, DTO field or hub method must match the ChatService controllers and `ChatHub`.

## Known limitations

- The backend URLs are hardcoded to localhost.
- The access token is kept in `localStorage`.
- There are no tests.
