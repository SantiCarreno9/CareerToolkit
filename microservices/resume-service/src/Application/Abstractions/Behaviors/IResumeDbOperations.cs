using Application.Resumes.Get;
using Domain.Entities;

namespace Application.Abstractions.Behaviors;
public interface IResumeDbOperations
{
    Task<IQueryable<GetResumesResponse?>> FullTextSearch(IQueryable<Resume?> queryableObject, string searchTerm);
}
