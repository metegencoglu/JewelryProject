import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  sessionHash: { type: String, required: true }, // stores hash of sessionId
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken', required: false },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  revokedAt: { type: Date, default: null },
  revokedReason: { type: String, default: null },
  lastUsedAt: { type: Date, default: null },
  meta: {
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    device: { type: String, default: null },
  }
}, { timestamps: true, collection: 'sessions' })

// TTL index to cleanup expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
SessionSchema.index({ user: 1 })
SessionSchema.index({ sessionHash: 1 }, { unique: true })

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)
