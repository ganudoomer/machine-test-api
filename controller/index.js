const router = require('express').Router();
const { db } = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.registerController = async (req, res) => {
	try {
		const collection = db().collection('users');
		const result = await collection.findOne({ email: req.body.email });
		if (!result) {
			const hash = await bcrypt.hash(req.body.password, 8);
			const user = {
				email: req.body.email,
				phone: req.body.phone,
				password: hash,
				dob: req.body.dob,
				gender: req.body.gender
			};
			const response = collection.insertOne(user);
			return res.json({ message: 'User Registered Successfully  ', status: 200 });
		}
		res.json({ message: 'User Already Exists ' });
	} catch (error) {
		console.log(error);
	}
};

module.exports.loginController = async (req, res) => {
	try {
		const collection = db().collection('users');
		const result = await collection.findOne({ email: req.body.email });
		if (result && (await bcrypt.compare(req.body.password, result.password))) {
			const token = jwt.sign({ email: result.email, id: result._id }, 'iknowwhatyoudidlastdummer');
			return res.json({ status: 200, token });
		}
		return res.json({ message: 'Something Went Wrong' });
	} catch (error) {
		console.log(error);
	}
};

module.exports.forgotPasswordController = async (req, res) => {
	try {
		const collection = db().collection('users');
		const result = await collection.findOne({ email: req.body.email });
		if (result) {
			const hash = await bcrypt.hash(req.body.password, 8);
			const response = await collection.updateOne({ email: result.email }, { $set: { password: hash } });
			console.log(response.modifiedCount);
			response.modifiedCount
				? res.json({ message: 'Password Updated ' })
				: res.json({ message: 'Something Went Wrong' });
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports.userInfoController = async (req, res) => {
	try {
		const decoded = jwt.verify(req.body.token, 'iknowwhatyoudidlastdummer');
		const collection = db().collection('users');
		const result = await collection.findOne({ email: decoded.email }, { projection: { _id: 0, password: 0 } });
		res.json(result);
	} catch (error) {
		return res.json({ message: error.message });
	}
};

module.exports.userEditController = async (req, res) => {
	try {
		const decoded = jwt.verify(req.body.token, 'iknowwhatyoudidlastdummer');
		const collection = db().collection('users');
		const hash = req.body.password ? await bcrypt.hash(req.body.password, 8) : null;
		const doc = {
			$set: {
				email: req.body.email,
				phone: req.body.phone,
				dob: req.body.dob,
				gender: req.body.gender
			}
		};
		if (req.body.password) doc.$set.password = hash;
		const result = await collection.updateOne({ email: decoded.email }, doc, { upsert: false });
		result.modifiedCount ? res.json({ message: ' Updated ' }) : res.json({ message: 'Something Went Wrong' });
	} catch (error) {
		return res.json({ message: error.message });
	}
};
