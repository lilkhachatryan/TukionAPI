const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectsSchema = new Schema({
    user_id: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    },
    canvas: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('projects', ProjectsSchema);

