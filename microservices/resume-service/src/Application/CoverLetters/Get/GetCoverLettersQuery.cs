using Application.Abstractions;
using Application.Abstractions.Messaging;

namespace Application.CoverLetters.Get;
public sealed record GetCoverLettersQuery(string SearchTerm, int Page, int PageSize) : IQuery<PagedList<GetCoverLettersResponse>>;

