const express = require('express');

const app = express();
const port = process.env.PORT || 3013;
const rootDir = process.argv[2] || 'src';

// Set public folder as root
app.use(express.static(rootDir));

// Listen for HTTP requests on port.
app.listen(port, () => {
  console.log('listening on %d', port);
});
