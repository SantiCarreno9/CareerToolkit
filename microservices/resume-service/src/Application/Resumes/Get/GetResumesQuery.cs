using Application.Abstractions;
using Application.Abstractions.Messaging;
using Application.Resumes.Shared;
using Domain;

namespace Application.Resumes.Get;
public sealed record GetResumesQuery(int Page, int PageSize) : IQuery<PagedList<ResumeResponse>>;

