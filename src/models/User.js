const mongoose = require('mongoose');

/*
    Esquema de Usuario
    userId: Generado automaticamente (1000-9999)
    email: Es unico y en se guarda en minusculas
    name: Validado y con límites de longitud
 */

const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },
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

/*
    Middleware pre-save:
    Genera un userId único solo al crear un documento, este lo genera entre 1000 y 9999.
 */

userSchema.pre('save', async function () {
    if (this.isNew && !this.userId) {
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const existing = await this.constructor.findOne({ userId: randomId });

            if (!existing) {
                this.userId = randomId;
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('No se pudo generar un userId único');
        }
    }
});

module.exports = mongoose.model('User', userSchema);