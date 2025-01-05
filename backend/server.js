const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const winston = require("winston");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/redux-posts-app",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

// Custom API Logger Middleware
const apiLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      params: req.params,
      query: req.query,
      body: req.method !== "GET" ? req.body : undefined,
    });
  });
  next();
};

app.use(apiLogger);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    body: req.method !== "GET" ? req.body : undefined,
  });

  res.status(500).json({ message: "Internal server error" });
});

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Number, required: true }, // Maps to PostAuthor userId
    date: { type: Date, default: Date.now },
    reactions: {
      thumbsUp: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      rocket: { type: Number, default: 0 },
      coffee: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);


// Posts Routes
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    logger.info(`Retrieved ${posts.length} posts successfully`);
    res.json(posts);
  } catch (error) {
    logger.error("Error fetching posts:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    logger.info("New post created:", {
      postId: savedPost._id,
      title: savedPost.title,
      content: savedPost.content,
    });
    res.status(201).json(savedPost);
  } catch (error) {
    logger.error("Error creating post:", error);
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!post) {
      logger.warn("Post not found for update:", {
        postId: req.params.id,
      });
      return res.status(404).json({ message: "Post not posted" });
    }
    logger.info("Post updated successfully:", {
      postId: post._id,
      name: post.name,
      course: post.course,
    });
    res.json(post);
  } catch (error) {
    logger.error("Error updating Post:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update post or reaction 
app.patch("/api/posts/:id", async (req, res) => {
  try {
    const { reaction } = req.body;

    // If a reaction is specified, increment it
    if (reaction) {
      const post = await Post.findById(req.params.id);
      if (!post) {
        logger.warn("Post not found for reaction update:", { postId: req.params.id });
        return res.status(404).json({ message: "Post not found" });
      }
      post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
      const updatedPost = await post.save();
      logger.info("Reaction updated successfully:", { postId: updatedPost._id });
      return res.json(updatedPost);
    }

    // Otherwise, perform a standard update
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      logger.warn("Post not found for update:", { postId: req.params.id });
      return res.status(404).json({ message: "Post not found" });
    }
    logger.info("Post updated successfully:", { postId: post._id });
    res.json(post);
  } catch (error) {
    logger.error("Error updating post:", error);
    res.status(400).json({ message: error.message });
  }
});


app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      logger.warn("Post not found for deletion:", {
        postId: req.params.id,
      });
      return res.status(404).json({ message: "post not found" });
    }
    logger.info("Post deleted successfully:", {
      postId: post._id,
      name: post.title,
      content: post.content,
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    logger.error("Error deleting post:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/posts/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    logger.info("post search initiated:", { searchTerm });

    const posts = await Post.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { course: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    logger.info("Post search completed:", {
      searchTerm,
      resultsCount: posts.length,
    });
    res.json(posts);
  } catch (error) {
    logger.error("Error searching posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Users Schema
const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

// Users Routes
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    logger.info(`Retrieved ${users.length} users successfully`);
    res.json(users);
  } catch (error) {
    logger.error("Error fetching posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Dashboard Stats
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const stats = await getDashboardStats();
    logger.info("Dashboard statistics retrieved successfully:", stats);
    res.json(stats);
  } catch (error) {
    logger.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function for dashboard stats
// async function getDashboardStats() {
//     const totalStudents = await Post.countDocuments();
// ## I have to modify this logic to make it count the emojiews or reactions on the Post ##
//     const activeStudents = await Post.countDocuments({ status: 'active' });
//     const totalCourses = await Course.countDocuments();
//     const activeCourses = await Course.countDocuments({ status: 'active' });
//     const graduates = await Student.countDocuments({ status: 'inactive' });
//     const courseCounts = await Student.aggregate([
//         { $group: { _id: '$course', count: { $sum: 1 } } }
//     ]);

//     return {
//         totalStudents,
//         activeStudents,
//         totalCourses,
//         activeCourses,
//         graduates,
//         courseCounts,
//         successRate: totalStudents > 0 ? Math.round((graduates / totalStudents) * 100) : 0
//     };
// }

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Detailed health check endpoint with MongoDB connection status
app.get("/health/detailed", async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    // Get system metrics
    const systemInfo = {
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        unit: "MB",
      },
      uptime: {
        seconds: Math.round(process.uptime()),
        formatted: formatUptime(process.uptime()),
      },
      nodeVersion: process.version,
      platform: process.platform,
    };

    // Response object
    const healthCheck = {
      status: "UP",
      timestamp: new Date(),
      database: {
        status: dbStatus,
        name: "MongoDB",
        host: mongoose.connection.host,
      },
      system: systemInfo,
      environment: process.env.NODE_ENV || "development",
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: "DOWN",
      timestamp: new Date(),
      error: error.message,
    });
  }
});

//Get single post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    logger.error("Error fetching Post:", error);
    res.status(500).json({ message: error.message });
  }
});


// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
