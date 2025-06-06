using Application.Abstractions.Messaging;
using Application.Resumes.Shared;

namespace Application.Resumes.Get;
public sealed record GetResumesQuery() : IQuery<List<ResumeResponse>>;

