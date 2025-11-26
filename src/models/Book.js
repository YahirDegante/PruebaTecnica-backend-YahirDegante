const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    author: {
        type: String,
        required: [true, 'El autor es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre del autor no puede exceder 100 caracteres']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    }
}, {
    timestamps: true
});

bookSchema.index({ title: 1, author: 1, userId: 1 }, { unique: true });
bookSchema.index({ userId: 1 });

module.exports = mongoose.model('Book', bookSchema);