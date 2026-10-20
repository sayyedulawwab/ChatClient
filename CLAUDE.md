# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

React 18 + TypeScript + Vite frontend for ChatService, using `@microsoft/signalr` for the chat hub.

- The ChatService API and hub URL is hardcoded in `src/api/apiClient.ts` and `src/components/Chat/ChatRoom.tsx`.
- Any change to an API call, DTO field, or hub method or event must match the ChatService controllers and `ChatHub`.
