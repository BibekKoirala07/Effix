const router = require('express').Router()

const {
  addServiceOrder,
  getServiceOrdersByCategories,
  getMyOrderedServices,
  getServiceOrder,
  deleteServiceOrder,
  acceptServiceOrder,
  withdrawServiceOrder,
  setOrderOnProgress,
  setOrderComplete,
  setOrderPaid,
  createPayment,
  paymentSuccessful,
  getMyAcceptedOrders,
  getAllActiveOrders,
} = require('../controllers/serviceOrder.controller')

const { isAuthenticated } = require('../controllers/user.controller')
const { isAdmin, isTechnician } = require('../../helpers/authorization')

router.post('/', isAuthenticated, addServiceOrder)
router.delete('/:id', isAuthenticated, deleteServiceOrder)

// the categories need to be in array so usign post insted of get
router.post('/getByCategories', isAuthenticated, getServiceOrdersByCategories)

router.get('/myOrders', isAuthenticated, getMyOrderedServices)

router.get('/accepted', isAuthenticated, isTechnician, getMyAcceptedOrders)

router.get('/active', isAuthenticated, isAdmin, getAllActiveOrders)

router.get('/:id', isAuthenticated, getServiceOrder)

router.post('/accept/:id', isAuthenticated, acceptServiceOrder)
router.post('/withdraw/:id', isAuthenticated, withdrawServiceOrder)
router.post('/onProgress/:id', isAuthenticated, setOrderOnProgress)
router.post('/complete/:id', isAuthenticated, setOrderComplete)
router.post('/paid/:id', isAuthenticated, setOrderPaid)

router.post('/pay/:id', isAuthenticated, createPayment)

// isAuthenticated not required, as it is called by paypal after successful transaction
// additional validation is performed in controller
router.get('/paymentSuccess/:id', paymentSuccessful)

module.exports = router
