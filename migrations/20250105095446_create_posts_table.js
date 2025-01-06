exports.up = function (knex) {
    return knex.schema.createTable('posts', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.text('images');
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // If a user is deleted, their posts will also be deleted
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('posts');
  };
  
