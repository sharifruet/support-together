const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const authenticate = require('./middleware/authMiddleware');

const app = express();
app.use(cors({ origin: '*', credentials: true }));

const port = process.env.PORT || 5000;
const db = require('./db');

// Middleware function to log incoming requests
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Add middleware to log requests
app.use(logRequests);

// Import routes
const ticketRoutes = require('./routes/ticketRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const topicRoutes = require('./routes/topicRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
const authRoutes = require('./routes/authRoutes');
const projectMembershipRoutes = require('./routes/projectMembershipRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const emailRoutes = require('./routes/emailRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const commentRoutes = require('./routes/commentRoutes');

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
app.use('/api', authRoutes);
app.use('/api', uploadRoutes);
app.use(authenticate); // Apply the authentication middleware to all routes after this line
app.use('/api', ticketRoutes);
app.use('/api', organizationRoutes);
app.use('/api', projectRoutes);
app.use('/api', topicRoutes);
app.use('/api', attachmentRoutes);
app.use('/api', projectMembershipRoutes);
app.use('/api', userRoleRoutes);
app.use('/api', emailTemplateRoutes);
app.use('/api', emailRoutes);
app.use('/api', inviteRoutes);
app.use('/api', commentRoutes);

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
