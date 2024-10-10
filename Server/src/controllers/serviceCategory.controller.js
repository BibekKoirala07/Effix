const ServiceCategory = require('../models/serviceCategory.model')

exports.addServiceCategory = async (req, res) => {
  const { title, description } = req.body
  try {
    const image = req.file ? req.file.path : undefined
    const newServiceCategory = new ServiceCategory({
      title,
      description,
      image,
    })
    await newServiceCategory.save()
    console.log(newServiceCategory)
    return res.status(201).json({ msg: 'Service Category added successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: err.message })
  }
}

exports.updateServiceCategoryImage = async (req, res) => {
  try {
    const image = req.file ? req.file.path : undefined
    await ServiceCategory.findByIdAndUpdate(req.params.id, { image })
    return res.status(200).send('Image updated successfully.')
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: err.message })
  }
}

exports.getAllServiceCategories = async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find({
      status: true,
    }).sort({ title: 'asc' })
    return res.status(200).send(serviceCategories)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error.message })
  }
}

exports.getServiceCategory = async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.findById(req.params.id)
    return res.status(200).send(serviceCategories)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error.message })
  }
}

exports.updateServiceCategory = async (req, res) => {
  const { title, description } = req.body
  try {
    const service = await ServiceCategory.findById(req.params.id)
    const image = req.file ? req.file.path : service.image

    await ServiceCategory.findByIdAndUpdate(req.params.id, {
      title,
      description,
      image,
    })
    return res.status(200).send('Service Category updated successfully')
  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: err.message })
  }
}

exports.deleteServiceCategory = async (req, res) => {
  try {
    await ServiceCategory.findByIdAndUpdate(req.params.id, { status: false })
    return res.status(200).send('Service Category deleted successfully')
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}
