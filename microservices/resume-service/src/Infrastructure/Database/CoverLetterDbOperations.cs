using Application.Abstractions.Behaviors;
using Application.CoverLetters.Get;
using Domain.Entities;

namespace Infrastructure.Database;
internal class CoverLetterDbOperations : ICoverLetterDbOperations
{
    public async Task<IQueryable<GetCoverLettersResponse?>> FullTextSearch(IQueryable<CoverLetter?> queryableObject, string searchTerm)
    {
        var filteredQuery = queryableObject
            .Select(cl => new GetCoverLettersResponse
            (
                cl.Id,
                cl.Name,
                cl.Keywords,
                cl.CreatedAt,
                cl.ModifiedAt
            ));
        //// Ensure null safety for properties
        //var filteredQuery = queryableObject.Where(r =>
        //    r != null &&
        //    EF.Functions.ToTsVector(
        //        "english",
        //        (r.Name ?? "") + " " +
        //        (r.JobPosting ?? "") + " " +
        //        (r.Keywords != null ? string.Join(" ", r.Keywords) : "")
        //    ).Matches(EF.Functions.PhraseToTsQuery("english", searchTerm))
        //)
        //    .Select(r => new
        //    {
        //        r.Id,
        //        r.Name,
        //        r.JobPosting,
        //        r.Keywords,
        //        r.CreatedAt,
        //        r.ModifiedAt,
        //        Rank = EF.Functions.ToTsVector("english",
        //        (r.Name ?? "") + " " +
        //        (r.JobPosting ?? "") + " " +
        //        (r.Keywords != null ? string.Join(" ", r.Keywords) : ""))
        //        .Rank(EF.Functions.PhraseToTsQuery("english", searchTerm))
        //    })
        //    .OrderByDescending(b => b.Rank)
        //    .Select(r => new GetResumesResponse(
        //        r.Id,
        //        r.Name,
        //        r.Keywords,
        //        r.CreatedAt,
        //        r.ModifiedAt));

        // Return as Task to match interface
        //return await Task.FromResult(filteredQuery);
        return await Task.FromResult(filteredQuery);
    }
}
