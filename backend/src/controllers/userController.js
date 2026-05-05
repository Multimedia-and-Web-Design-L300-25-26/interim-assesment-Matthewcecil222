const { sendSuccess } = require("../utils/response");

const getProfile = async (req, res) => {
  sendSuccess(res, 200, "Profile fetched successfully", {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
  });
};

module.exports = {
  getProfile,
};
