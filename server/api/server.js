import express from "express";
import cors from "cors";
import session from "express-session";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

// Generate a secure JWT secret
const JWT_SECRET = crypto.randomBytes(64).toString("hex");

const dbURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://mateobenis05:gzY6kJ0JnXtPAbaZ@exchange.ns2xm.mongodb.net/?retryWrites=true&w=majority&appName=Exchange";

mongoose

  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error(err));

const countrySchema = new mongoose.Schema({
  name: String,
  flag: String,
  currency: String,
  usd_price: Number,
  enabled: { type: Boolean, default: true },
});

const Countries = mongoose.model("countries", countrySchema);

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("admin", adminSchema);

const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  isVisible: { type: Boolean, default: false }, // Added isVisible field
});

const Comments = mongoose.model("comments", commentSchema);

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "clave",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }, // Cambiar esto si se va a usar HTTPS
  })
);

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );

  res.send("Server running on port 3001");

  console.log("Server running on port 3001");
});

app.get("/api/getCountries", async (req, res) => {
  try {
    const AllCountries = await Countries.find({});
    res.json(AllCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/updateCountries", async (req, res) => {
  try {
    const updates = req.body;
    const bulkOps = updates.map((country) => ({
      updateOne: {
        filter: { _id: country._id },
        update: { $set: country },
      },
    }));

    await Countries.bulkWrite(bulkOps);
    res.status(200).json({ message: "Países actualizados exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/addCountry", async (req, res) => {
  try {
    const newCountry = new Countries(req.body);
    await newCountry.save();
    res
      .status(201)
      .json({ message: "País agregado exitosamente", country: newCountry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/disableCountry/:id", async (req, res) => {
  try {
    await Countries.findByIdAndUpdate(req.params.id, { enabled: false });
    res.status(200).json({ message: "País deshabilitado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/enableCountry/:id", async (req, res) => {
  try {
    await Countries.findByIdAndUpdate(req.params.id, { enabled: true });
    res.status(200).json({ message: "País habilitado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/getComments", async (req, res) => {
  try {
    const allComments = await Comments.find(); // Return all comments
    res.json(allComments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/createComment", async (req, res) => {
  try {
    const newComment = new Comments(req.body);
    await newComment.save();
    res.status(201).json({
      message: "Comentario agregado exitosamente",
      comment: newComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { name, password } = req.body;

  const admin = await Admin.findOne({ name });

  if (!admin || admin.password !== password) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Autenticado correctamente", token });
});

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    next();
  });
}
app.get("/api/admin", isAuthenticated, (req, res) => {
  res.send("Bienvenido al panel de control");
});

app.put("/api/updateCommentsVisibility", async (req, res) => {
  try {
    const updates = req.body;
    const bulkOps = updates.map((comment) => ({
      updateOne: {
        filter: { _id: comment._id },
        update: { $set: { isVisible: comment.isVisible } },
      },
    }));

    await Comments.bulkWrite(bulkOps);
    res.status(200).json({ message: "Comentarios actualizados exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/deleteComments", async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of comment IDs to delete
    await Comments.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Comentarios eliminados exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/deleteCountry/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Countries.findByIdAndDelete(id);
    res.status(200).json({ message: "País eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
}

export default app;
