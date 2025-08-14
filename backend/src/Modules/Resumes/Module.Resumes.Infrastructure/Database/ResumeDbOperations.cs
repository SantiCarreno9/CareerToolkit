using Microsoft.EntityFrameworkCore;
using Module.Resumes.Application.Abstractions.Behaviors;
using Module.Resumes.Application.Resumes.Get;
using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Infrastructure.Database;
internal class ResumeDbOperations : IResumeDbOperations
{
    public async Task<IQueryable<GetResumesResponse?>> FullTextSearch(IQueryable<Resume?> queryableObject, string searchTerm)
    {
        // Ensure null safety for properties
        var filteredQuery = queryableObject.Where(r =>
            r != null &&
            EF.Functions.ToTsVector(
                "english",
                (r.Name ?? "") + " " +
                (r.JobPosting ?? "") + " " +
                (r.Keywords != null ? string.Join(" ", r.Keywords) : "")
            ).Matches(EF.Functions.PhraseToTsQuery("english", searchTerm))
        )
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.JobPosting,
                r.Keywords,
                r.CreatedAt,
                r.ModifiedAt,
                Rank = EF.Functions.ToTsVector("english",
                (r.Name ?? "") + " " +
                (r.JobPosting ?? "") + " " +
                (r.Keywords != null ? string.Join(" ", r.Keywords) : ""))
                .Rank(EF.Functions.PhraseToTsQuery("english", searchTerm))
            })
            .OrderByDescending(b => b.Rank)
            .Select(r => new GetResumesResponse(
                r.Id,
                r.Name,
                r.Keywords,
                r.CreatedAt,
                r.ModifiedAt));

        // Return as Task to match interface
        return await Task.FromResult(filteredQuery);
    }
}
