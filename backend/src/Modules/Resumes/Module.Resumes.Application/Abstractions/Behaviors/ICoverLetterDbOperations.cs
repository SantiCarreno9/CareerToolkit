using Module.Resumes.Application.CoverLetters.Get;
using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Application.Abstractions.Behaviors;
public interface ICoverLetterDbOperations
{
    Task<IQueryable<GetCoverLettersResponse?>> FullTextSearch(IQueryable<CoverLetter?> queryableObject, string searchTerm);
}
