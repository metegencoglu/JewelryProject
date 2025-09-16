import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    // Try connecting normally first
    cached!.promise = mongoose.connect(MONGODB_URI, opts).catch(async (err) => {
      // If we detect an SSL/TLS error, try a debug fallback with relaxed TLS settings
      console.error('Initial Mongo connect failed:', err)
      const msg = (err && (err.message || '')).toString().toLowerCase()
      if (msg.includes('ssl') || msg.includes('tls') || (err as any)?.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
        console.warn('Mongo connect failed due to SSL/TLS. Attempting debug retry with relaxed TLS options (tlsAllowInvalidCertificates=true).')
        try {
          const fallbackOpts = { ...opts, tls: true, tlsAllowInvalidCertificates: true }
          return await mongoose.connect(MONGODB_URI, fallbackOpts)
        } catch (retryErr) {
          console.error('Fallback mongo connect also failed:', retryErr)
          throw retryErr
        }
      }
      throw err
    })
  }

  try {
    cached!.conn = await cached!.promise
    // Debug: print connected DB name and readyState to help verify which DB instance the server is using
    try {
      // eslint-disable-next-line no-console
      console.debug('MongoDB connected:', {
        name: mongoose.connection.name,
        host: (mongoose.connection as any).host || null,
        readyState: mongoose.connection.readyState,
      })
    } catch (e) {
      // ignore logging errors
    }
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default connectDB