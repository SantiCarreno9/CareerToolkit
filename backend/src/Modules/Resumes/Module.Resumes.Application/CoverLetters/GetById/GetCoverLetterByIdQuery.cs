using Module.Resumes.Application.CoverLetters.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.CoverLetters.GetById;
public sealed record GetCoverLetterByIdQuery(string Id) : IQuery<CoverLetterResponse>;
