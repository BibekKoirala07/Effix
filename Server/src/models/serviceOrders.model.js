const { Schema, model, Types, default: mongoose } = require('mongoose')

const serviceOrderSchema = new Schema(
  {
    orderedBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    acceptedBy: {
      type: Types.ObjectId,
      ref: 'User',
    },

    notes: {
      type: String,
      default: 'N/A',
    },

    // input as price details for different services
    estimatedPriceDetails: {
      type: String,
      default: 'N/A',
    },
    // technician will update this after service complete
    amount: {
      type: mongoose.Decimal128,
    },
    status: {
      type: String,
      enum: ['ordered', 'accepted', 'onProgress', 'completed', 'paid'],
      required: true,
      default: 'ordered',
    },
  },
  { timestamps: true },
)

module.exports = model('ServiceOrder', serviceOrderSchema)
