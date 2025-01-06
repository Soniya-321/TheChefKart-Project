module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './my_database.db', //Path to the database
    },
    useNullAsDefault: true, // SQLite needs this
  },
};
