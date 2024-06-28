exports.up = (knex) =>
  knex.schema.createTable("tags", (table) => {
    table.increments("id");
    table.text("name").notNullable(); //Not permit "null"

    table.integer("user_id").references("id").inTable("users");
    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE"); //"onDelete("CASCADE")" is used to delete all tags associated with a note when the note is deleted
  });

exports.down = (knex) => knex.schema.dropTable("tags");
