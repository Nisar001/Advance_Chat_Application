const User = require("../models/UserModel");
const { getPagination } = require("../utils/pagination");

exports.getUsers = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const users = await User.find()
      .skip(offset)
      .limit(limit)
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { name, page = 1, size = 10 } = req.query;
    const { limit, offset } = getPagination(page, size);

    const pipeline = [
      {
        $match: {
          username: { $regex: name, $options: "i" },
        },
      },
      {
        $skip: [limit - 1] * offset,
      },
      {
        $limit: offset,
      },
    ];

    const result = await User.aggregate(pipeline);
    return result.items === 0
      ? res.status(200).json({
          message: "Back to the previous index, no more items are found",
        })
      : res.status(200).json({ ...result });
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
};
