const Projects = require('../models/Projects');
const jwt = require('jsonwebtoken');
const KEYS = require('../../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (req, res) => {
    try {
        if (req.headers && req.headers['token']) {
            let authorization = req.headers['token'].split(' ')[1], decoded;
            try {
                decoded = jwt.verify(authorization, KEYS.jwt);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }

            const user_id = decoded.userId;
            // const { user_id } = req.query;

            const projects = await Projects.find({ user_id });
            res.send(projects);
        }
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.create = async (req, res) => {
    try {
        if (req.headers && req.headers['authorization']) {
            let authorization = req.headers['authorization'].split(' ')[1], decoded;
            try {
                decoded = jwt.verify(authorization, KEYS.jwt);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }

            const user_id = decoded.userId;
            // const { user_id } = req.query;

            const project = await new Projects({
                // user_id: req.body.user_id,
                user_id,
                canvas: req.body.canvas
            }).save();

            res.status(201).json({
                project
            });
        }
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.update = async function (req,res) {
    try {
        if (req.headers && req.headers['authorization']) {
            let authorization = req.headers['authorization'].split(' ')[1], decoded;
            try {
                jwt.verify(authorization, KEYS.jwt);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }

            const project = await Projects.findOneAndUpdate({
                _id: req.params.id
            },{
                $set: req.body
            },{
                new: true
            });
            res.status(200).json(project);
        }
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.delete = async function (req,res) {
    try {
        if (req.headers && req.headers['authorization']) {
            let authorization = req.headers['authorization'].split(' ')[1], decoded;
            try {
                jwt.verify(authorization, KEYS.jwt);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }

            const project = await Projects.deleteOne({
                _id: req.params.id
            });
            console.log('project->', project);
            res.status(200).json('Deleted successfully');
        }
    } catch (e) {
        errorHandler(res, e);
    }
};
