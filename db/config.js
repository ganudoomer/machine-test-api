const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const state = {
	db: null
};
module.exports.connect = function() {
	return new Promise((resolve, reject) => {
		client
			.connect()
			.then((client) => {
				const db = client.db('demo');
				state.db = db;
				resolve();
			})
			.catch((err) => {
				reject(err);
			});
	});
};

module.exports.db = function() {
	return state.db;
};
