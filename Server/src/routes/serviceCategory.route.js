const router = require('express').Router()
const {
  addServiceCategory,
  updateServiceCategoryImage,
  updateServiceCategory,
  deleteServiceCategory,
  getAllServiceCategories,
  getServiceCategory,
} = require('../controllers/serviceCategory.controller')

const { isAuthenticated } = require('../controllers/user.controller')
const { isAdmin } = require('../../helpers/authorization')

const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileDestination = `./uploads/serviceImages`
    try {
      if (!fs.existsSync(fileDestination)) {
        fs.mkdirSync(fileDestination, { recursive: true })
      }
    } catch (error) {
      console.log(error)
    }

    cb(null, fileDestination)
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-').replace('.', '-') +
        file.originalname,
    )
  },
})

const fileFilter = (req, file, cb) => {
  //reject file
  // console.log(file)

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limts: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: fileFilter,
})

router.post(
  '/',
  upload.single('image'),
  isAuthenticated,
  isAdmin,
  addServiceCategory,
)

router.patch(
  '/:id/image',
  upload.single('image'),
  isAuthenticated,
  isAdmin,
  updateServiceCategoryImage,
)

router.patch(
  '/:id',
  upload.single('image'),
  isAuthenticated,
  isAdmin,
  updateServiceCategory,
)
router.delete('/:id', isAuthenticated, isAdmin, deleteServiceCategory)

router.get('/:id', getServiceCategory)
router.get('/', getAllServiceCategories)

module.exports = router
