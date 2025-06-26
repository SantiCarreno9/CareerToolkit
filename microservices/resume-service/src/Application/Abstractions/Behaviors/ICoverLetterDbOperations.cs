using Application.CoverLetters.Get;
using Domain.Entities;

namespace Application.Abstractions.Behaviors;
public interface ICoverLetterDbOperations
{
    Task<IQueryable<GetCoverLettersResponse?>> FullTextSearch(IQueryable<CoverLetter?> queryableObject, string searchTerm);
}
