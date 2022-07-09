const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                field: "_uid",
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profession: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM,
                values: ["admin", "student"],
                allowNull: false,
                defaultValue: "student",
            },
            createdAt: {
                field: "created_at",
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                field: "updated_at",
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            tableName: "users",
            modelName: "User",
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 9);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 9);
                    }
                },
            },
        }
    );

    User.beforeCreate((user, _) => {
        return (user.id = uuidv4());
    });
    return User;
};
