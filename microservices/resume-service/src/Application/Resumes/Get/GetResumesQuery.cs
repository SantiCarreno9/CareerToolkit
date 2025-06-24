using Application.Abstractions;
using Application.Abstractions.Messaging;

namespace Application.Resumes.Get;
public sealed record GetResumesQuery(string SearchTerm, int Page, int PageSize) : IQuery<PagedList<GetResumesResponse>>;

