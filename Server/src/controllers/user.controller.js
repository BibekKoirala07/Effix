"use strict";
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
// const paypal = require('@paypal/checkout-server-sdk')
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");
const paypal = require("paypal-rest-sdk");
const { sendEmail } = require("../../helpers/email");
const { default: mongoose } = require("mongoose");
const { Decimal128 } = mongoose.Types;

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

exports.registerController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }

  const {
    name,
    email,
    phone,
    password,
    address,
    // added
    role = "user",
    // role,
    categories,
    experience,
  } = req.body;

  console.log(
    "req.body",
    name,
    email,
    phone,
    password,
    address,
    // added
    role,
    // role,
    categories,
    experience
  );

  const savingPasswordDirectly = password;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with that email or phone exists" });
    }

    // added
    let experienceValue = experience;
    if (!experience || isNaN(experience)) {
      experienceValue = 0;
    }

    const newUser = new User({
      name,
      email,
      phone,
      savingPasswordDirectly,
      password,
      address,
      // commented
      role,
      // added
      categories,
      // experience: "" ? undefined : experience,
      experience: Decimal128.fromString(experienceValue.toString()),
    });

    console.log("newUser", newUser);

    const token = jwt.sign(
      {
        name,
        email,
        phone,
        password,
        address,
        role,
        categories,
        experience,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "1d",
      }
    );
    console.log("token", token);
    // sgMail.setApiKey(process.env.MAIL_KEY);

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account Activation`,
      html: `
                    <h1>Please use the following link to activate your account</h1>
                    <a href = ${process.env.CLIENT_URL}/users/activation/${token}> Click me</a>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
    };

    // await Promise.all([sgMail.send(emailData), newUser.save()]);
    await Promise.all([sendEmail(emailData), newUser.save()]);

    console.log("ho ra ? yeha aai sakyo");
    return res
      .status(201)
      .send(
        "Account has been created. Please check your email to activate account"
      );
  } catch (error) {
    console.log(error);
    console.log("error in register", error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.resendActivationController = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    const {
      name,
      email,
      phone,
      password,
      address,
      role,
      categories,
      experience,
    } = user;

    const token = jwt.sign(
      {
        name,
        email,
        phone,
        password,
        address,
        role,
        categories,
        experience,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "1d",
      }
    );
    sgMail.setApiKey(process.env.MAIL_KEY);

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account Activation`,
      html: `
                    <h1>Please use the following link to activate your account</h1>
                    <a href = ${process.env.CLIENT_URL}/users/activation/${token}> Click me</a>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
    };

    // await Promise.all([sendEmail(emailData), newUser.save()]);
    await sgMail.send(emailData);

    return res
      .status(201)
      .send(
        "Activation email has been sent. Please check your email to activate account"
      );
  } catch (error) {
    console.log(JSON.stringify(error));
    return res.status(500).json({ msg: error.message });
  }
};

exports.activationController = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    if (!decoded) {
      console.log(token, decoded);
      return res.status(400).send("Invalid Link");
    }
    const user = await User.findOne({ email: decoded.email });
    user.activated = true;
    console.log("user activated controller");
    await user.save();

    return res.status(200).send(`User activated successfully`);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Invalid Link" });
  }
};

exports.loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }
  const { email, password, remember } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: email }, { phone: email }],
    }).select("+hashedPassword +salt +activated");
    if (user) {
      if (!user.activated) {
        // to request for activation email again, _id is sent so that the token could be again requested
        return res.status(423).json({
          msg: "User not activated. Please activate to login.",
          _id: user._id,
        });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: "The credentials do not match." });
      }

      // if remember set cookie for 30 days, else store for 3 hours
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: remember ? "30d" : "3h",
      });
      res.cookie("effix-token", token, {
        expires: new Date(
          Date.now() + remember ? 30 * 24 * 60 * 60 * 1000 : 3 * 60 * 60 * 1000
        ),
      });

      return res.status(200).send({ token: token });
    }
    return res.status(400).json({ msg: "The credentials do not match." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.isAuthenticated = async (req, res, next) => {
  console.log("authorization", req.get("Authorization"));
  try {
    const token = await req.get("Authorization").split(" ")[1];
    if (!token || token == "undefined") {
      // if (!token) {
      return res.status(401).json({ msg: "Please login to continue" });
    }
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ msg: "Please login to continue" });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Please login to continue" });
  }
};

exports.requireSignIn = (req, res) => {
  // isAuthenticated is a middleware that checks if the user is logged in
  // requireSignIn then after being authenticated, will return user info
  const user = res.locals.user;
  return res.status(200).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address
      ? user.address
      : {
          state: "",
          city: "",
          street: "",
          postalCode: "",
          apartment: "",
        },
    categories: user.categories,
    balance: user.balance,
    commissionToPay: user.commissionToPay,
  });
};

exports.logoutController = (req, res) => {
  res.clearCookie("effix-token");
  return res.status(200).json({ msg: "Logout successful" });
};

exports.getUserController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("categories");
    // if normal user, don't send category and experience, and balance
    if (user.role === "user" || user.role === "admin") {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
          ? user.address
          : {
              state: "",
              city: "",
              street: "",
              postalCode: "",
              apartment: "",
            },
      });
    }
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    // const limit = req.query.limit ? req.query.limit : 10
    // const page = req.query.page ? req.query.page : 1
    // const startAt = (page - 1) * limit

    const users = await User.find({ role: req.query.role, status: true })
      // .skip(startAt)
      // .limit(limit)
      .sort({ createdAt: 1 })
      .lean();
    return res.status(200).send(users);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: err.message });
  }
};

exports.updateUserController = async (req, res) => {
  const { name, phone, address, categories, experience } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, {
      name,
      phone,
      address,
      categories,
      experience,
    });
    return res.status(200).send("User updated successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.updatePasswordController = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findById(req.params.id).select(
      "+hashedPassword +salt"
    );
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ msg: "New password and confirm password do not match" });
    } else if (!user.comparePassword(oldPassword)) {
      return res.status(400).json({ msg: "Invalid old password" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json("Password updated successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateEmailController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findById(req.params.id).select(
      "+hashedPassword +salt"
    );
    if (!user.comparePassword(password)) {
      return res.status(400).json({ msg: `Incorrect password` });
    }
    const token = jwt.sign(
      {
        _id: req.params.id,
        newEmail: email,
      },
      process.env.JWT_RESET_EMAIL,
      {
        expiresIn: "30m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Email Reset link`,
      html: `
                    <h1>Please use the following link to change your email</h1>
                    <p>${process.env.CLIENT_URL}/users/email/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
    };
    // sgMail.setApiKey(process.env.MAIL_KEY);

    // await sgMail.send(emailData);
    await Promise.all([sendEmail(emailData), newUser.save()]);
    return res
      .status(200)
      .send(`An activation email has been sent to ${email}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: err.message });
  }
};

exports.resetEmailController = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_EMAIL);
    await User.findByIdAndUpdate(decoded._id, { email: decoded.newEmail });
    return res.status(200).send(`Email Updated`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: `Invalid Url` });
  }
};

exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select("+resetPasswordLink");
    if (user) {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_RESET_PASSWORD,
        {
          expiresIn: "10m",
        }
      );
      // sgMail.setApiKey(process.env.MAIL_KEY);

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset link`,
        html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
      };

      user.resetPasswordLink = token;
      await Promise.all([sendEmail(emailData), newUser.save()]);
      // await Promise.all([sgMail.send(emailData), user.save()]);
      return res
        .status(200)
        .send(
          `If an account exists with that email account, an email to reset password will be sent.`
        );
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.resetPasswordController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors);
  }
  const { resetPasswordLink, newPassword, confirmPassword } = req.body;

  try {
    if (resetPasswordLink) {
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ msg: "New password and confirm password do not match" });
      }
      const verified = jwt.verify(
        resetPasswordLink,
        process.env.JWT_RESET_PASSWORD
      );
      if (!verified) {
        return res.status(400).json({ msg: "Link Expired" });
      }

      const user = await User.findOne({ resetPasswordLink }).select(
        "+resetPasswordLink"
      );

      user.resetPasswordLink = "";
      user.password = newPassword;

      await user.save();
      return res.status(200).send("Password updated successfully");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

exports.addAdminController = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const user = new User({
      name,
      email,
      phone,
      password,
      role: "admin",
      activated: true,
    });
    await user.save();
    return res.status(200).send("Admin added successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

// + is payable by user
// - is receivable by user
exports.changeBalance = async (id, amount) => {
  try {
    console.log(id, amount);
    await User.findByIdAndUpdate(id, {
      $inc: { balance: amount },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.addCommision = async (id, amount) => {
  try {
    const a = await User.findByIdAndUpdate(id, {
      $inc: {
        commissionToPay: parseFloat(process.env.COMMISSION_RATE) * amount,
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// another function
// create a payment request by technician to withdraw his balance
exports.requestPayment = async (req, res) => {
  try {
    const user = res.locals.user;
    const { receiverPaypalEmail } = req.body;
    if (user.role !== "technician") {
      return res.staus(400).send({ msg: "Error: Not Found!" });
    }

    // balance in - represents the amount of money that technician wants to withdraw
    // if balance is -90 and threshold is 100, then technician can't withdraw 90
    if (parseFloat(user.balance) > process.env.BALANCE_WITHDRAW_THRESHOLD) {
      return res.status(400).send({
        msg: `Can't withdraw before ${Math.abs(
          parseInt(process.env.BALANCE_WITHDRAW_THRESHOLD)
        )}`,
      });
    }
    const withdrawingBalance = (
      -1 *
      (parseFloat(user.balance) -
        (parseFloat(user.commissionToPay)
          ? parseFloat(user.commissionToPay)
          : 0))
    ).toFixed(2);

    console.log(
      withdrawingBalance.toString(),
      parseFloat(user.balance),
      parseFloat(user.commissionToPay),
      (
        -1 *
        (parseFloat(user.balance) -
          (parseFloat(user.commissionToPay)
            ? parseFloat(user.commissionToPay)
            : 0))
      ).toFixed(2)
    );
    if (withdrawingBalance <= 0)
      return res
        .status(400)
        .send({ msg: "You don't have enough balance in your account" });

    var create_payout_json = {
      sender_batch_header: {
        email_subject: "You have a Efix payment",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: withdrawingBalance,
            currency: "USD",
          },
          receiver: receiverPaypalEmail,
          note: `Efix Payment for ${user.name}`,
        },
      ],
    };

    const sync_mode = "false";

    paypal.payout.create(
      create_payout_json,
      sync_mode,
      async (error, _payout) => {
        if (error) {
          console.log(error.response);
          return res.status(500).json({
            msg: `Error while processing payment. Please try again later`,
          });
        } else {
          await User.findByIdAndUpdate(user._id, {
            balance: 0,
            commissionToPay: 0,
          });
          return res.status(200).send("Payment request sent successfully");
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: `Error while processing payment. Please try again later` });
  }
};

exports.deleteUserController = async (req, res) => {
  try {
    const user = res.locals.user;
    if (user.role !== "admin") {
      return res.status(400).send({ msg: "Error: Not Found!" });
    }
    await User.findByIdAndUpdate(req.params.id, { status: false });
    return res.status(200).send("User deleted successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
