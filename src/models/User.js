const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);