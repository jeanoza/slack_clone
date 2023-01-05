## TO MEMORYZIE

1. Hot realoding: https://docs.nestjs.com/recipes/hot-reload

2. Dotenv(.env): https://docs.nestjs.com/techniques/configuration#getting-started

3. typeorm-model-generator: https://www.npmjs.com/package/typeorm-model-generator

4. Why use index?

   https://www.ibm.com/support/pages/why-indexing-used-database#:~:text=Question%3A-,Why%20Indexing%20is%20used%20in%20database%3F,direct%2C%20fast%20access%20to%20rows.&text=The%20users%20cannot%20see%20the,to%20speed%20up%20searches%2Fqueries.

5. onDelete: 'SET NULL' vs 'CASCADE'

   - 'SET NULL' : When parent table is deleted, child table's reference became NULL
   - 'CASCADE' : child table will be deleted.

   ex1. table 'normal' having foreign key and its primary key => use 'SET NULL'
   => because, without foreign key, this table has to alive.
   ex2. table 'relation' having no primary key => use 'CASCADE'
   => because, this table exist only for the relation between two table.
   (Cannot exist independantly without RELATION)

6. Two OneToMany with relation table => ManyToMany

   - After test all

7. Create MVC model : g == generate

   - module: nest g mo <NAME>
   - service: nest g s <NAME>
   - controller: nest g co <NAME>

8. How to use raw query with typeorm(write directly query)?

- https://stackoverflow.com/questions/44493554/does-typeorm-supports-raw-sql-queries-for-input-and-output

9. class validator && ExceptionFilter => to process error response.

10. request life cycle : https://docs.nestjs.com/faq/request-lifecycle
