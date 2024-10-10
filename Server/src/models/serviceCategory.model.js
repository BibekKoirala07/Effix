const { Schema, model, Types } = require('mongoose')

const serviceCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
})

module.exports = model('ServiceCategory', serviceCategorySchema)
