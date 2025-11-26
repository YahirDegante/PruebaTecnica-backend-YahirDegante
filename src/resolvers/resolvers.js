const User = require('../models/User');
const Book = require('../models/Book');

//Resolvers para consultas y mutaciones de usuarios y libros.

const resolvers = {
    Query: {
        //Obtiene todos los usuarios
        users: async () => {
            return await User.find().sort({ createdAt: -1 });
        },

        //Obtiene un usuario por su userId
        user: async (_, { userId }) => {
            const user = await User.findOne({ userId });
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        },

        //Obtiene todos los libros
        books: async () => await Book.find().sort({ createdAt: -1 }),

        //Obtiene un libro por su bookId
        book: async (_, { bookId }) => {
            const book = await Book.findOne({ bookId });
            if (!book) throw new Error('Libro no encontrado');
            return book;
        },

        //Obtiene todos los libros de un usuario específico
        userBooks: async (_, { userId }) => {
            const user = await User.findOne({ userId });
            if (!user) throw new Error('Usuario no encontrado');
            return await Book.find({ userId }).sort({ createdAt: -1 });
        }
    },
    
    Mutation: {
        //Crea un nuevo usuario
        createUser: async (_, { input }) => {
            const existingUser = await User.findOne({ email: input.email.toLowerCase() });
            if (existingUser) throw new Error('Ya existe un usuario con ese email');

            const user = new User({
                name: input.name.trim(),
                email: input.email.toLowerCase().trim()
            });
            return await user.save();
        },
        
        //Actualiza un usuario existente
        updateUser: async (_, { userId, input }) => {
            if (input.email) {
                const existingUser = await User.findOne({
                    email: input.email.toLowerCase(),
                    userId: { $ne: userId }
                });
                if (existingUser) throw new Error('Ya existe un usuario con ese email');
            }
            const user = await User.findOneAndUpdate(
                { userId },
                { $set: input },
                { new: true, runValidators: true }
            );
            if (!user) throw new Error('Usuario no encontrado');
            return user;
        },
        
        //Elimina un usuario y sus libros asociados
        deleteUser: async (_, { userId }) => {
            await Book.deleteMany({ userId });
            const user = await User.findOneAndDelete({ userId });
            if (!user) throw new Error('Usuario no encontrado');
            return true;
        },
        
        //Crea un nuevo libro para un usuario específico
        createBook: async (_, { userId, input }) => {
            const user = await User.findOne({ userId });
            if (!user) throw new Error('Usuario no encontrado');
            //Verificar si el usuario ya tiene un libro con el mismo título y autor
            const existingBook = await Book.findOne({ 
                userId, 
                title: input.title.trim(),
                author: input.author.trim()
            });
            
            if (existingBook) {
                throw new Error('Este usuario ya tiene un libro con el mismo título y autor');
            }
            const book = new Book({
                title: input.title.trim(),
                author: input.author.trim(),
                userId: userId
            });
            return await book.save();
        },

        //Actualiza un libro existente
        updateBook: async (_, { bookId, input }) => {
            if (input.title) input.title = input.title.trim();
            if (input.author) input.author = input.author.trim();
            const book = await Book.findOneAndUpdate(
                { bookId },
                { $set: input },
                { new: true, runValidators: true }
            );
            if (!book) throw new Error('Libro no encontrado');
            return book;
        },

        //Elimina un libro por su bookId
        deleteBook: async (_, { bookId }) => {
            const book = await Book.findOneAndDelete({ bookId });
            if (!book) throw new Error('Libro no encontrado');
            return true;
        }
    },
    
    //Obtiene los libros de un usuario
    User: {
        books: async (parent) => {
            return await Book.find({ userId: parent.userId }).sort({ createdAt: -1 });
        }
    },

    //Obtiene el usuario de un libro
    Book: {
        user: async (parent) => {
            return await User.findOne({ userId: parent.userId });
        }
    }
};

module.exports = resolvers;