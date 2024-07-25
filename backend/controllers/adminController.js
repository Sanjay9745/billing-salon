const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Item = require("../models/Items");
const Redeem = require("../models/Redeem");
const jetSecret = process.env.JWT_ADMIN_SECRET;
const moment = require("moment");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).send("Invalid email or password");
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    const token = jwt.sign({ _id: admin._id }, jetSecret);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const ProtectedRoute = async (req, res) => {
  res.status(200).send("This is a protected route");
};
const CreateUser = async (req, res) => {
  try {
    const { email, phone_number, name } = req.body;
    if (!email || !phone_number || !name)
      return res.status(400).send("Please provide all the required fields");
    // Check if the user already exists with the email or phone number
    const user = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (user) {
      return res.status(200).json(user);
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetUsers = async (req, res) => {
  try {
    const { email, phone_number, name, page, perPage } = req.query;
    let query = {};
    if (email) query.email = email;
    if (phone_number) query.phone_number = phone_number;
    if (name) {
      //search by name
      query.name = { $regex: name, $options: "i" };
    }
    if (page && perPage) {
      const users = await User.find(query)
        .skip((parseInt(page) - 1) * parseInt(perPage))
        .limit(parseInt(perPage)).sort({ _id: -1 });
      res.status(200).json({
        users,
        total: await User.countDocuments(query),
        currentPage: parseInt(page),
        perPage: parseInt(perPage),
      });
    } else {
      const users = await User.find(query).sort({ _id: -1 });
      res.status(200).json({
        users,
        total: users.length,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const AddItemToUser = async (req, res) => {
  try {
    const { itemId, email, phone_number, quantity, name } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone_number }] });
    // Check if the user exists if no user create one user
    if (!user) {
      const newUser = new User(req.body);
      await newUser.save();
      user = newUser;
    }
    if (user.name === "") {
      user.name = name;
    }
    const item = await Item.findById(itemId);
    if (!item) return res.status(400).send("Item not found");
    //get date and time indian standard time
    const date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
    user.items.push({
      itemId,
      quantity: quantity,
      price: item.price * quantity,
      date: date,
    });
    item.totalSales += quantity;
    user.wallet += item.discount * quantity;
    await item.save();
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetItemsFromUser = async (req, res) => {
  try {
    const { email, phone_number, userId } = req.query;
    const user = null;
    if (email || phone_number) {
      const newUser = await User.findOne({
        $or: [{ email }, { phone_number }],
      });
      user = newUser;
    } else {
      const newUser = await User.findById(userId);
      user = newUser;
    }

    if (!user) return res.status(400).send("User not found");
    const items = await Item.find({
      _id: { $in: user.items.map((i) => i.itemId) },
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetUserOrders = async (req, res) => {
  try {
    const { filter,search } = req.query;
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    const users = await User.find(query).sort({ _id: -1});
    let orders = [];
    for (let user of users) {
      for (let item of user.items) {
        let itemDetails = await Item.findById(item.itemId);
        orders.push({
          user: user,
          item: {
            itemDetails: itemDetails,
            quantity: item.quantity,
            price: item.price,
            date: item.date,
          },
        });
      }
    }
    if (filter) {
      const now = new Date();
      if (filter === "today") {
        orders = orders.filter((order) => {
          return moment(order.item.date).isSame(now, "day");
        });
      } else if (filter === "week") {
        if (filter) {
          const now = moment().startOf("day");
          if (filter === "today") {
            orders = orders.filter((order) => {
              return moment(order.item.date).startOf("day").isSame(now);
            });
          } else if (filter === "week") {
            orders = orders.filter((order) => {
              return now.isoWeek() === moment(order.item.date).isoWeek();
            });
          } else if (filter === "month") {
            orders = orders.filter((order) => {
              return moment(order.item.date)
                .startOf("month")
                .isSame(now.startOf("month"));
            });
          } else if (filter === "year") {
            orders = orders.filter((order) => {
              return moment(order.item.date)
                .startOf("year")
                .isSame(now.startOf("year"));
            });
          }
        }
        orders = orders.filter((order) => {
          return moment(order.item.date).isSame(now, "isoWeek");
        });
      } else if (filter === "month") {
        orders = orders.filter((order) => {
          return moment(order.item.date).isSame(now, "month");
        });
      } else if (filter === "year") {
        orders = orders.filter((order) => {
          return moment(order.item.date).isSame(now, "year");
        });
      }
    }
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const DeleteOrderFromUser = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");
    console.log(user.items);

    const itemIndex = user.items.findIndex((i) => i.itemId === itemId);
    if (itemIndex === -1) return res.status(400).send("Item not found");
    user.items.splice(itemIndex, 1);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(400).send("User not found");
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateUser = async (req, res) => {
  try {
    const {
      userId,
      email,
      phone_number,
      address,
      date_of_birth,
      wallet,
      name,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");
    //if email or phone number is changed check if the new email or phone number is not already taken
    if (email) {
      const userExists = await User.findOne({ email });
      if (userExists && userExists._id.toString() !== userId)
        return res.status(400).send("Email already taken");
    }
    if (phone_number) {
      const userExists = await User.findOne({ phone_number });
      if (userExists && userExists._id.toString() !== userId)
        return res.status(400).send("Phone number already taken");
    }
    if (address) user.address = address;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (wallet) user.wallet = wallet;
    if (name) user.name = name;
    if (phone_number) user.phone_number = phone_number;
    if (email) user.email = email;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const DeleteItemFromUser = async (req, res) => {
  try {
    const { userId, itemId } = req.query;
    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User not found");
    user.items = user.items.filter((i) => i.itemId !== itemId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const CreateItem = async (req, res) => {
  try {
    const { name, price, quantity, description, image, category, discount } =
      req.body;
    const newItem = new Item({
      name,
      price,
      quantity,
      description,
      image,
      category,
      discount,
    });
    await newItem.save();
    res.status(200).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetItems = async (req, res) => {
  try {
    const { category, page, perPage, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (page && perPage) {
      const items = await Item.find(query)

        .skip((parseInt(page) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
      res.status(200).json({
        items,
        total: await Item.countDocuments(query),
        currentPage: parseInt(page),
        perPage: parseInt(perPage),
      });
    } else {
      const items = await Item.find(query);
      res.status(200).json(items);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(400).send("Item not found");
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateItem = async (req, res) => {
  try {
    const {
      itemId,
      name,
      price,
      quantity,
      description,
      image,
      category,
      discount,
    } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(400).send("Item not found");
    if (name) item.name = name;
    if (price) item.price = price;
    if (quantity) item.quantity = quantity;
    if (description) item.description = description;
    if (image) item.image = image;
    if (category) item.category = category;
    if (discount) item.discount = discount;
    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const DeleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) return res.status(400).send("Item not found");
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const CreateRedeem = async (req, res) => {
  try {
    const { name, points, description, image, category } = req.body;
    const newReedeem = new Redeem({
      name,
      points,
      description,
      image,
      category,
    });
    await newReedeem.save();
    res.status(200).json(newReedeem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const GetRedeem = async (req, res) => {
  try {
    const reedeems = await Redeem.find();
    res.status(200).json(reedeems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const UpdateRedeem = async (req, res) => {
  try {
    const { reedemId, name, points, description, image, category } = req.body;
    const reedeem = await Redeem.findById(reedemId);
    if (!reedeem) return res.status(400).send("Reedeem not found");
    if (name) reedeem.name = name;
    if (points) reedeem.points = points;
    if (description) reedeem.description = description;
    if (image) reedeem.image = image;
    if (category) reedeem.category = category;
    await reedeem.save();
    res.status(200).json(reedeem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const DeleteRedeem = async (req, res) => {
  try {
    const { reedemId } = req.query;
    const reedeem = await Redeem.findByIdAndDelete(reedemId);
    if (!reedeem) return res.status(400).send("Reedeem not found");
    res.status(200).json({ message: "Reedeem deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const HomeStatitics = async (req, res) => {
  try {
  //get total revenue 
  //get total users 
  //get total orders
  //get total revenue of last month
  //get the total users who have ordered in the last month

  const users = await User.find();
  const totalUsers = users.length;
  let totalRevenue = 0;
  let totalOrders = 0;
  let lastMonthRevenue = 0;
  let lastMonthUsers = 0;
  for (let user of users) {
    for (let item of user.items) {
      totalRevenue += item.price;
      totalOrders++;
      let now = new Date();
      if (moment(item.date).isSame(now, "month")) {
        lastMonthRevenue += item.price;
      }
      if (moment(item.date).isSame(now, "month")) {
        lastMonthUsers++;
      }
    }
  }
  res.status(200).json({
    totalRevenue,
    totalUsers,
    totalOrders,
    lastMonthRevenue,
    lastMonthUsers,
  });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  Login,
  ProtectedRoute,
  CreateUser,
  GetUsers,
  GetUser,
  AddItemToUser,
  GetItemsFromUser,
  GetUserOrders,
  DeleteOrderFromUser,
  DeleteUser,
  UpdateUser,
  DeleteItemFromUser,
  CreateItem,
  GetItems,
  GetItem,
  UpdateItem,
  DeleteItem,
  CreateRedeem,
  GetRedeem,
  UpdateRedeem,
  DeleteRedeem,
  HomeStatitics,
};
