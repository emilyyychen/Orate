# CLAUDE.md

When in doubt, ask.

## Project

A weekly check-in and team health app for leads and members of a small design team.

## Stack

Expo SDK 58 + React Native 0.88.1, Expo Router 58, TypeScript.
Supabase (Auth, Postgres, Storage).

Screens live in `/app`, components in `/components` (one per file), the Supabase client and helpers in `/lib`.

## Design

Warm, rounded Spark design system — tokens in `constants/Spark.ts`, Figma link: https://www.figma.com/design/xDjHmwB6Pr6fsVZvHgSaTH

## Rules

Match the Figma exactly. Tokens only, never a raw hex.
Every screen handles empty, loading and error.
No query returns another member's individual answers.
The state matrix in `/docs` is the source of truth.

## Don't touch

The `.env` file, production keys, token names.
No new dependencies without asking. No dark mode in v1. No renaming tokens.
