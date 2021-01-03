const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const routes = require('./routes');
const { connect } = require('./db/config');
const morgan = require('morgan');
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use('/api', routes);
//Mongodb Connection
connect()
	.then(() => {
		console.log('Connected to db');
	})
	.catch((err) => {
		console.log(err);
	});

app.listen(PORT, console.log(`Api running on port ${PORT}`));
