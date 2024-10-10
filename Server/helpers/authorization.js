exports.authorizeOwner = async (req, res, next) => {
  try {
    // authorizeOwner checks the if the requesting user is the owner of that account
    if (req.params.id !== res.locals.user._id.toString()) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (res.locals.user.role !== "admin") {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  next();
};

exports.isTechnician = (req, res, next) => {
  if (res.locals.user.role !== "technician") {
    return res.status(401).json({ msg: "Must be a technician" });
  }
  next();
};
