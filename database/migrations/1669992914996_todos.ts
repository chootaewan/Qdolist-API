import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "todos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary()
      table
        .integer("category_id")
        .unsigned()
        .references("id")
        .inTable("categories")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("content", 511).notNullable();
      table.boolean("is_done").notNullable().defaultTo(false); //boolean을 쓸때, is로 시작되는 값이 있으면 암묵적으로 boolean값이다 라고 인식.
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
