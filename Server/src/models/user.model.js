const { Schema, model, Types, default: mongoose } = require("mongoose");
const crypto = require("crypto");

const addressSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      default: "",
      required: true,
    },
    city: {
      type: String,
      default: "",
      required: true,
    },
    street: {
      type: String,
      default: "",
      required: true,
    },
    postalCode: {
      type: String,
      default: "",
      required: true,
    },
    apartment: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    savingPasswordDirectly: {
      type: String,
    },
    hashedPassword: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    resetPasswordLink: {
      type: String,
      default: "",
      select: false,
    },
    activated: {
      type: Boolean,
      // default: false,
      default: true,
      select: false,
    },
    // address should be required for technician, check in validation
    address: {
      type: addressSchema,
    },
    role: {
      type: String,
      enum: ["user", "admin", "technician"],
      default: "user",
      required: false,
    },

    // only for technicians, required will be checked via validators
    categories: {
      // in case of multiple services
      type: [Types.ObjectId],
      ref: "ServiceCategory",
    },
    // in terms if years
    experience: {
      type: mongoose.Decimal128,
    },
    //balance of technician
    balance: {
      type: mongoose.Decimal128,
      default: 0,
    },
    // if all payment was done online
    // we could have calculated while withdrawing
    // but offline payments also can be done
    // so adding commision everytime a payment is made
    commissionToPay: {
      type: mongoose.Decimal128,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  comparePassword: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

module.exports = model("User", userSchema);
