module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define(
        "RefreshToken",
        {
            id: {
                field: "token_id",
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
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
            tableName: "refresh_tokens",
            modelName: "RefreshToken",
        }
    );

    return RefreshToken;
};
