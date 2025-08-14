using Module.Resumes.Application.Abstractions;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.Get;
public sealed record GetResumesQuery(string SearchTerm, int Page, int PageSize) : IQuery<PagedList<GetResumesResponse>>;

