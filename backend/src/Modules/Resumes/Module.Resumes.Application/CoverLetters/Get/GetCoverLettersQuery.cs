using Module.Resumes.Application.Abstractions;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.Get;
public sealed record GetCoverLettersQuery(string SearchTerm, int Page, int PageSize) : IQuery<PagedList<GetCoverLettersResponse>>;

