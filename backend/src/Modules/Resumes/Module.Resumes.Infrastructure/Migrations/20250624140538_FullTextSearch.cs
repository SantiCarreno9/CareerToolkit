using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FullTextSearch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
//            migrationBuilder.Sql(@"
//    CREATE INDEX ix_resumes_fulltext
//    ON public.resumes
//    USING GIN (
//        (
//            setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
//            setweight(to_tsvector('english', coalesce(job_posting, '')), 'B') ||
//            setweight(to_tsvector('english', coalesce(keywords, '')), 'C')
//        )
//    );
//");



        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS ix_resumes_fulltext;");
        }
    }
}
