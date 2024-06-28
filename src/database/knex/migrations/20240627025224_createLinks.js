exports.up = (knex) =>
  knex.schema.createTable("links", (table) => {
    table.increments("id");
    table.text("url").notNullable(); //Not permit "null"

    table
      .integer("note_id")
      .references("id")
      .inTable("notes")
      .onDelete("CASCADE"); //"onDelete("CASCADE")" is used to delete all tags associated with a note when the note is deleted;

    table.timestamp("created_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("links");
