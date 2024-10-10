const ServiceOrder = require("../models/serviceOrders.model");

const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const paypal = require("paypal-rest-sdk");
const { changeBalance, addCommision } = require("./user.controller");
const { sendEmail } = require("../../helpers/email");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

exports.addServiceOrder = async (req, res) => {
  const { service, notes } = req.body;
  if (!service) {
    return res.status(400).send("Please select a service");
  }
  const newServiceOrder = new ServiceOrder({
    orderedBy: res.locals.user._id,
    service,
    notes,
    status: "ordered",
  });
  try {
    if (res.locals.user.balance <= parseInt(process.env.BALANCE_THRESHOLD)) {
      return res
        .status(400)
        .send({ msg: "Please pay your remaining dues to order a new service" });
    }
    await newServiceOrder.save();
    return res.status(201).send("Service Order added successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getServiceOrdersByCategories = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const { categories } = req.body;

    const serviceOrders = await ServiceOrder.find({
      service: { $in: categories },
      status: "ordered",
    })
      // .skip(startAt)
      // .limit(limit)
      .sort({ updatedAt: -1 })
      .populate("orderedBy", "name eamil phone")
      .populate("service")
      .lean();
    return res.status(200).send(serviceOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getMyOrderedServices = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const serviceOrders = await ServiceOrder.find({
      orderedBy: res.locals.user._id,
    })
      // .skip(startAt)
      // .limit(limit)
      .sort({ createdAt: -1 })
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service")
      .lean();
    return res.status(200).send(serviceOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getMyAcceptedOrders = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const serviceOrders = await ServiceOrder.find({
      acceptedBy: res.locals.user._id,
    })
      // .skip(startAt)
      // .limit(limit)
      .sort({ createdAt: -1 })
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service")
      .lean();
    return res.status(200).send(serviceOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getAllActiveOrders = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const serviceOrders = await ServiceOrder.find({
      status: { $nin: ["completed", "paid"] },
    })
      // .skip(startAt)
      // .limit(limit)
      .sort({ createdAt: -1 })
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service")
      .lean();
    return res.status(200).send(serviceOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const serviceOrders = await ServiceOrder.find()
      // .skip(startAt)
      // .limit(limit)
      .sort({ createdAt: -1 })
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service")
      .lean();
    return res.status(200).send(serviceOrders);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.getServiceOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service");
    if (
      res.locals.user.role === "admin" ||
      res.locals.user._id === order.orderedBy._id ||
      res.locals.user._id === order.acceptedBy._id
    ) {
      return res.status(200).send(order);
    }
    return res.status(404).json({ msg: "Error! Not Found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteServiceOrder = async (req, res) => {
  try {
    const serviceOrder = await ServiceOrder.findById(req.params.id);

    // only the ordering user or admin can delete the order
    // only if the order is not on progress or completed or paid
    if (
      res.locals.user.role !== "admin" ||
      serviceOrder.orderedBy.toString() !== res.locals.user._id.toString()
    ) {
      console.log(serviceOrder.orderedBy, res.locals.user._id);
      return res.status(401).send({ msg: "Unauthorized" });
    }
    if (
      serviceOrder.status === "ordered" ||
      serviceOrder.status === "accepted"
    ) {
      await serviceOrder.remove();
      return res.status(200).send("Service Order deleted successfully");
    }
    return res.status(400).json({ msg: "Service has been provided" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.acceptServiceOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("service");

    if (
      res.locals.user.role !== "technician" ||
      !res.locals.user.categories.includes(
        new mongoose.Types.ObjectId(order.service)
      )
    ) {
      return res.status(400).send({
        msg: "Only technician with this service in their profile can accept the order",
      });
    }

    if (order.status === "ordered") {
      order.status = "accepted";
      order.acceptedBy = res.locals.user._id;
      // sgMail.setApiKey(process.env.MAIL_KEY)

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: order.orderedBy.email,
        subject: `Order Accepted`,
        html: `
                <h1>Greetings ${order.orderedBy.name}</h1>
                <p>Your order for ${order.service.title} has been accepted by technician ${res.locals.user.name}</p>
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };

      // Using your custom sendEmail function
      await Promise.all([sendEmail(emailData), order.save()]);

      // await Promise.all([sgMail.send(emailData), order.save()])
      return res.status(200).send("Service Order accepted successfully");
    }
    return res.status(400).json({ msg: "Service Order is not ordered" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.withdrawServiceOrder = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("acceptedBy", "name email phone")
      .populate("service");
    // only admin or the technician who accepted earlier can withdraw the order
    if (
      res.locals.user._id.toString() !== order.acceptedBy._id.toString() &&
      res.locals.user._id.toString() !== order.orderedBy._id.toString() &&
      res.locals.user.role !== "admin"
    ) {
      console.log(res.locals.user._id, order.acceptedBy, order.orderedBy._id);
      return res.status(400).send({
        msg: "Only technician who accepted the order or the customer who ordered the service can withdraw the order",
      });
    }

    if (order.status === "accepted") {
      // sgMail.setApiKey(process.env.MAIL_KEY);

      const customerEmail = {
        from: process.env.EMAIL_FROM,
        to: order.orderedBy.email,
        subject: `Order Withdrawn`,
        html: `
                <h1>Greetings ${order.orderedBy.name}</h1>
                <p>Your order for ${order.service.title} has been withdrawn. It will be again listed on our page for other technicians to be accepted.</p>
                <p>We are sorry for the inconvenience occured</p>
                <hr/>
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };
      const technicianEmail = {
        from: process.env.EMAIL_FROM,
        to: order.acceptedBy.email,
        subject: `Order Withdrawn`,
        html: `
                <h1>Greetings ${order.orderedBy.name}</h1>
                <p>The order you accepted for ${order.service.title} has been withdrawn.</p>
                <p>We are sorry for the inconvenience occured</p>
                <hr/>
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };

      order.status = "ordered";
      order.acceptedBy = undefined;

      // Using your custom sendEmail function
      await Promise.all([sendEmail(customerEmail), order.save()]);
      await Promise.all([sendEmail(technicianEmail), order.save()]);

      // await Promise.all([
      //   sgMail.send(customerEmail),
      //   sgMail.send(technicianEmail),
      //   order.save(),
      // ]);
      return res.status(200).send("Service Order withdrawn successfully");
    }
    return res.status(400).json({ msg: "Service Order is not accepted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.setOrderOnProgress = async (req, res) => {
  try {
    const { estimatedPriceDetails } = req.body;
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("service");

    // only the technician who accepted earlier can set the order on progress
    if (res.locals.user._id.toString() !== order.acceptedBy.toString()) {
      return res.status(400).send({
        msg: "Only technician who accepted the order can set the order on progress",
      });
    }

    if (order.status === "accepted") {
      order.status = "onProgress";
      order.estimatedPriceDetails = estimatedPriceDetails;
      // sgMail.setApiKey(process.env.MAIL_KEY);

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: order.orderedBy.email,
        subject: `Order On Progress`,
        html: `
                <h1>Greetings ${order.orderedBy.name}</h1>
                <p>Your order for ${order.service.title} has been set on progress by technician ${res.locals.user.name}</p>
                <p>The estimated price details as per your requirements provided by the technician are: </p>
                <p>${estimatedPriceDetails}</p>
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
                    `,
      };

      // Using your custom sendEmail function
      await Promise.all([sendEmail(emailData), order.save()]);

      // await Promise.all([sgMail.send(emailData), order.save()]);
      return res.status(200).send("Service Order on progress successfully");
    }
    return res.status(400).json({ msg: "Service Order is not accepted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.setOrderComplete = async (req, res) => {
  const { amount } = req.body;
  try {
    if (!amount || parseInt(amount) < 5) {
      return res
        .status(400)
        .send("Amount must be greater than 5 for the service to be completed");
    }
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("service");

    // only the technician who accepted earlier can set the order on progress
    if (res.locals.user._id.toString() !== order.acceptedBy.toString()) {
      return res.status(400).send({
        msg: "Only technician who accepted the order can set the order status to complete",
      });
    }

    if (order.status === "onProgress") {
      order.status = "completed";
      order.amount = amount;

      if (!(await changeBalance(order.orderedBy._id, -amount)))
        return res.status(500).send({ msg: "Error in updating balance" });

      // sgMail.setApiKey(process.env.MAIL_KEY);

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: order.orderedBy.email,
        subject: `Order Complete`,
        html: `
                <h1>Greetings ${order.orderedBy.name}</h1>
                <p>Your order for ${order.service.title} has been completed by technician ${res.locals.user.name}</p>
                <p>The amount to be paid to the technician is: ${amount}</p>
                <p>You can pay the amount via online payment system integrated in our website.</p>
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      };

      // Using your custom sendEmail function
      await Promise.all([sendEmail(emailData), order.save()]);

      // await Promise.all([sgMail.send(emailData), order.save()]);
      return res.status(200).send("Service Order completed successfully");
    }
    return res.status(400).json({ msg: "Service Order is not on progress" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.setOrderPaid = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id)
      .populate("orderedBy", "name email phone")
      .populate("service");

    // only the technician who accepted earlier can set the order on progress
    if (res.locals.user._id.toString() !== order.acceptedBy.toString()) {
      return res.status(400).send({
        msg: "Only technician who accepted the order can set the order status to paid",
      });
    }
    if (order.status === "paid") {
      return res.status(400).send({ msg: "Order is already paid" });
    }

    if (order.status === "completed") {
      order.status = "paid";
      // sgMail.setApiKey(process.env.MAIL_KEY);

      if (
        !(await addCommision(res.locals.user._id, order.amount)) ||
        !(await changeBalance(order.orderedBy._id, order.amount))
      )
        return res.status(400).send({ msg: "Error in updating balance" });

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: order.orderedBy.email,
        subject: `Service Payment Received`,
        html: `
                    <h1>Greetings ${order.orderedBy.name}</h1>
                    <p>Your order for ${order.service.title} has been paid to the technician ${res.locals.user.name}</p>
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
      };

      // Using your custom sendEmail function
      await Promise.all([sendEmail(emailData), order.save()]);
      // await Promise.all([sgMail.send(emailData), order.save()]);
      return res.status(200).send("Service Order paid successfully");
    }
    return res.status(400).json({ msg: "Service Order is not completed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

// to be implemented
// use paypal api to create a payment request
// payment done by customer, then deposited in efix's account
// technician will later withdraw the amount from his account
// after the payment is done, add commision amount to technician account

exports.createPayment = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id);

    if (order.status !== "completed") {
      return res.status(400).send({ msg: "Can't pay right now" });
    }

    if (order.orderedBy.toString() !== res.locals.user._id.toString())
      return res
        .status(401)
        .send({ msg: "You are not authorized to make this payment" });

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.BACKEND_URL}/serviceOrder/paymentSuccess/${req.params.id}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: req.params.id,
                price: order.amount.toString(),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: order.amount.toString(),
          },
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log(error);
        return res.status(400).send({
          msg: "There seem to be some problem in our side. Please try again later.",
        });
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            // res.redirect(payment.links[i].href)
            res.send(payment.links[i].href);
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.paymentSuccessful = (req, res) => {
  const { paymentId } = req.query;
  return paypal.payment.get(paymentId, async (err, payment) => {
    // if the orderId in req params is same as in paypal transaction item, verified the payment

    try {
      if (
        payment &&
        payment.transactions[0].item_list.items[0].name === req.params.id
      ) {
        const order = await ServiceOrder.findById(req.params.id)
          .populate("orderedBy", "name email phone")
          .populate("acceptedBy", "name email phone")
          .populate("service");
        const emailData1 = {
          from: process.env.EMAIL_FROM,
          to: order.orderedBy.email,
          subject: `Service Payment Received`,
          html: `
                    <h1>Greetings ${order.orderedBy.name}</h1>
                    <p>Your order for ${order.service.title} has been paid to the technician ${order.acceptedBy.name}</p>
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        const emailData2 = {
          from: process.env.EMAIL_FROM,
          to: order.acceptedBy.email,
          subject: `Service Payment Received`,
          html: `
                    <h1>Greetings ${order.acceptedBy.name}</h1>
                    <p>Your service for ${order.service.title} has been paid by ${order.orderedBy.name}</p>
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
        };

        const addBalanceToCustomer = changeBalance(
          order.orderedBy,
          order.amount
        );
        const reduceBalanceFromTechnician = changeBalance(
          order.acceptedBy,
          -order.amount
        );
        const addCommisionToTechnician = addCommision(
          order.acceptedBy,
          order.amount
        );
        order.status = "paid";
        // sgMail.setApiKey(process.env.MAIL_KEY);

        // Using your custom sendEmail function
        await Promise.all([
          sendEmail(emailData1),
          sendEmail(emailData2),
          order.save(),
          addBalanceToCustomer,
          reduceBalanceFromTechnician,
          addCommision,
        ]);
        // await Promise.all([
        //   sgMail.send(emailData1),
        //   sgMail.send(emailData2),
        //   order.save(),
        //   addBalanceToCustomer,
        //   reduceBalanceFromTechnician,
        //   addCommisionToTechnician,
        // ]);
        //redirect to FE payment success url
        return res
          .status(200)
          .redirect(`${process.env.CLIENT_URL}/payment/successful`);
      }

      return res.status(404).json({ msg: "Error! Not Found" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    } finally {
    }
  });
};
