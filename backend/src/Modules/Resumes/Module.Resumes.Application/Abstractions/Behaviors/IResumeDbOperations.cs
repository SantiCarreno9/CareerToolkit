using Module.Resumes.Application.Resumes.Get;
using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Application.Abstractions.Behaviors;
public interface IResumeDbOperations
{
    Task<IQueryable<GetResumesResponse?>> FullTextSearch(IQueryable<Resume?> queryableObject, string searchTerm);
}
