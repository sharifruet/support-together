const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');

const app = express();
app.use(cors({origin: '*', credentials: true }));

const port = process.env.PORT || 3000;
const db = require('./db'); // Import Sequelize instance

// Middleware function to log incoming requests
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Call next to move to the next middleware function
};


// Add middleware to log requests
app.use(logRequests);

// Import routes
const ticketRoutes = require('./routes/ticketRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const topicRoutes = require('./routes/topicRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const projectMembershipRoutes = require('./routes/projectMembershipRoutes'); // Import project membership routes
const userRoleRoutes = require('./routes/userRoleRoutes'); // Import user role routes
const worker = require('./services/screduleService');

const job = schedule.scheduleJob("*/1 * * * *", worker.run);

// Middleware to parse JSON requests
app.use(express.json());

// Root endpoint to check if server is running
app.get('/', (req, res) => {
  res.send({ name: "support-together-api", status: 'Running..', timestamp: Date.now() });
});

app.get('/api', (req, res) => {
  res.send({ name: "support-together-api", status: 'Running..', timestamp: Date.now() });
});

// Use routes
app.use('/api', ticketRoutes);
app.use('/api', organizationRoutes);
app.use('/api', projectRoutes);
app.use('/api', topicRoutes);
app.use('/api', attachmentRoutes);
app.use('/api', authRoutes); // Add auth routes here
app.use('/api', projectMembershipRoutes); // Add project membership routes here
app.use('/api', userRoleRoutes); // Add user role routes here

// Sync models with database
db.sync()
  .then(() => {
    console.log('Database synced');
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
