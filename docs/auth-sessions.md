Session & Refresh Token Integration

Overview
- We keep NextAuth for signIn/signOut/getSession/useSession flows.
- Add a server-side session document for each successful login. The client receives an HttpOnly `sessionId` cookie (opaque random string), plus an HttpOnly `refreshToken` cookie. Access token remains short-lived JWT stored in localStorage.
- On refresh, server validates sessionId and refreshToken (rotation). Sessions are stored in `sessions` collection and linked to `refreshTokens` by ObjectId.

MongoDB sessions collection schema (recommended)
- collection name: `sessions`
- sample schema (Mongoose representation used in the project):
  - sessionHash: string (sha256 of sessionId) - unique
  - user: ObjectId (ref: User)
  - refreshToken: ObjectId (ref: RefreshToken) - optional
  - expiresAt: Date
  - revoked: Boolean (default: false)
  - lastUsedAt: Date
  - meta: { ip, userAgent, device }
  - timestamps

Validator suggestion (JSON Schema for collMod)
- Note: Atlas collection validators often fail due to Mongo adding `_id` and `__v` fields. Below validator allows additionalProperties and only enforces key fields.

Example collMod (run in mongo shell or Atlas UI):
{
  collMod: "sessions",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sessionHash", "user", "expiresAt"],
      properties: {
        sessionHash: { bsonType: "string" },
        user: { bsonType: "objectId" },
        refreshToken: { bsonType: ["objectId", "null"] },
        expiresAt: { bsonType: "date" },
        revoked: { bsonType: "bool" }
      }
    }
  },
  validationLevel: "moderate"
}

Operations and endpoints
- POST /api/auth/login
  - Accepts email/password (or use NextAuth signIn then call /api/auth/refresh)
  - Creates access token (15m), refresh token (opaque) saved hashed, session doc created and sessionId cookie set (HttpOnly)

- POST /api/auth/refresh
  - Validates refreshToken and sessionId (if provided). Rotates refresh token and associates new refreshToken id with session. Returns new access token. Supports fallback to NextAuth server token for issuance when needed.

- POST /api/auth/revoke
  - Revokes refresh token and deletes session(s). Clears cookies.

Frontend flow (recommended)
- Login: Call NextAuth signIn('credentials') OR POST to /api/auth/login; wait for session cookie to exist (server sets HttpOnly cookie). Then call /api/auth/refresh (POST, credentials:'include') to get accessToken which you store in localStorage.
- Use authFetch helper that attaches Authorization: Bearer <accessToken> header. If 401, call refreshAccessToken() which POSTs /api/auth/refresh with credentials included. If refresh succeeds, retry original request.
- Logout: call authClient.logout() (which calls /api/auth/revoke with credentials included) and then NextAuth signOut.

Security recommendations
- Always set HttpOnly and Secure flags for cookies in production.
- Use SameSite=lax or strict depending on cross-site needs.
- Hash sessionId and refresh tokens in DB (sha256) — store only the hash.
- Implement rotation and mark old refresh tokens revoked.
- Implement pruning: TTL indexes on expiresAt for sessions and refresh tokens; run periodic job to cleanup revoked tokens older than X.
- Rate-limit login and refresh endpoints.

Next steps
- Apply the provided collMod in Atlas to ensure validators don't reject Mongo-added fields (`_id`, `__v`).
- Restart dev server and test: register -> signIn -> POST /api/auth/refresh -> inspect DB docs in `sessions` and `refreshTokens` collections.

