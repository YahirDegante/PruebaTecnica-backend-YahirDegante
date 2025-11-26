const mongoose = require('mongoose');

/*
    Esquema de Libro
    bookId: Generado automaticamente (1000-9999)
    title: Validado y con límites de longitud
    author: Validado y con límites de longitud
    userId: Referencia al userId del Usuario (Number) son los 4 digitos
*/

const bookSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        unique: true
    },
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
        maxlength: [100, 'El autor no puede exceder 100 caracteres']
    },
    userId: {
        type: Number,
        required: [true, 'El userId es obligatorio'],
        ref: 'User'
    }
}, {
    timestamps: true
});

/*
    Middleware pre-save:
    Genera un bookId único solo al crear un documento, este lo genera entre 1000 y 9999.
*/

bookSchema.pre('save', async function() {
    if (this.isNew && !this.bookId) {
        let isUnique = false;
        let attempts = 0;
        
        while (!isUnique && attempts < 10) {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const existing = await this.constructor.findOne({ bookId: randomId });
            
            if (!existing) {
                this.bookId = randomId;
                isUnique = true;
            }
            attempts++;
        }
        
        if (!isUnique) {
            throw new Error('No se pudo generar un bookId único');
        }
    }
});

module.exports = mongoose.model('Book', bookSchema);