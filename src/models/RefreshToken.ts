import mongoose from 'mongoose'

const RefreshTokenSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  revokedAt: { type: Date, default: null },
  revokedReason: { type: String, default: null },
  replacedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken', default: null },
  lastUsedAt: { type: Date, default: null },
  meta: {
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    device: { type: String, default: null },
  }
}, { timestamps: true, collection: 'refreshTokens' })

// Indexes
// Unique lookup by tokenHash (stores hash of the plain token)
RefreshTokenSchema.index({ tokenHash: 1 }, { unique: true })
// TTL index: MongoDB will remove documents when expiresAt is reached
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
// For querying all tokens by user
RefreshTokenSchema.index({ user: 1 })

export default mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshTokenSchema)
