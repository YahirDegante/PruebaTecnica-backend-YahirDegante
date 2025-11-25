const User = require('../models/User');

const resolvers = {
    Query: {
        users: async () => {
            return await User.find().sort({ createdAt: -1 });
        },
        user: async (_, { id }) => {
            const user = await User.findById(id);
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        },

        books: async () => await Book.find().populate('userId').sort({ createdAt: -1 }),

        book: async (_, { id }) => {
            const book = await Book.findById(id).populate('userId');
            if (!book) throw new Error('Libro no encontrado');
            return book;
        },

        userBooks: async (_, { userId }) => {
            const user = await User.findById(userId);
            if (!user) throw new Error('Usuario no encontrado');
            return await Book.find({ userId }).populate('userId').sort({ createdAt: -1 });
        }
    },
    Mutation: {
        createUser: async (_, { input }) => {
            const existingUser = await User.findOne({ email: input.email.toLowerCase() });
            if (existingUser) throw new Error('Ya existe un usuario con ese email');

            const user = new User({
                name: input.name.trim(),
                email: input.email.toLowerCase().trim()
            });
            return await user.save();
        },
        updateUser: async (_, { id, input }) => {
            if (input.email) {
                const existingUser = await User.findOne({
                    email: input.email.toLowerCase(),
                    _id: { $ne: id }
                });
                if (existingUser) throw new Error('Ya existe un usuario con ese email');
            }

            const user = await User.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true, runValidators: true }
            );
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        },
        deleteUser: async (_, { id }) => {
            const user = await User.findByIdAndDelete(id);
            if (!user) throw new Error('Usuario no encontrado');
            return true;
        },
        createBook: async (_, { userId, input }) => {
            const user = await User.findById(userId);
            if (!user) throw new Error('Usuario no encontrado');

            const book = new Book({
                title: input.title.trim(),
                author: input.author.trim(),
                userId: userId
            });

            try {
                return await book.save();
            } catch (error) {
                if (error.code === 11000) {
                    throw new Error('Este usuario ya tiene un libro con el mismo título y autor');
                }
                throw error;
            }
        },

        updateBook: async (_, { id, input }) => {
            if (input.title) input.title = input.title.trim();
            if (input.author) input.author = input.author.trim();

            const book = await Book.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true, runValidators: true }
            ).populate('userId');

            if (!book) throw new Error('Libro no encontrado');
            return book;
        },

        deleteBook: async (_, { id }) => {
            const book = await Book.findByIdAndDelete(id);
            if (!book) throw new Error('Libro no encontrado');
            return true;
        }
    },
    User: {
        books: async (parent) => await Book.find({ userId: parent._id }).sort({ createdAt: -1 })
    },

    Book: {
        user: async (parent) => await User.findById(parent.userId)
    }
};

module.exports = resolvers;