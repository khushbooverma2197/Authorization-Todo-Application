const app = require('./app');
require('dotenv').config();

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   TODO Application Server Started Successfully    ║
╠════════════════════════════════════════════════════╣
║   Port: ${PORT}                                      ║
║   Environment: ${process.env.NODE_ENV || 'development'}                        ║
║   Timestamp: ${new Date().toISOString()}    ║
╠════════════════════════════════════════════════════╣
║   Available Routes:                                ║
║   POST /signup      - Register new user            ║
║   POST /login       - Login user                   ║
║   POST /todos       - Create todo (Protected)      ║
║   GET  /todos       - Get todos (Protected)        ║
║   PUT  /todos/:id   - Update todo (Protected)      ║
║   DELETE /todos/:id - Delete todo (Protected)      ║
╚════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
