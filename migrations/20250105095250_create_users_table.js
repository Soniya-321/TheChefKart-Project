exports.up = function (knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('mobile_number').unique().notNullable();
      table.string('address');
      table.integer('post_count').defaultTo(0);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  