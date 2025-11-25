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
        }
    }
};

module.exports = resolvers;