module.exports = (sequelize, DataTypes) => {
	var Users= sequelize.define('Users', {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull:false,
		},
		password: {
				allowNull: false,
				type: DataTypes.STRING
		},
		firstname: {
				allowNull: false,
				type: DataTypes.STRING
		},
		lastname: {
				allowNull: false,
				type: DataTypes.STRING
		},
	});
	return Users;
};