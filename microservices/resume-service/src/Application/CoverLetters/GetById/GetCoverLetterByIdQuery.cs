using Application.Abstractions.Messaging;
using Application.CoverLetters.Shared;

namespace Application.CoverLetters.GetById;
public sealed record GetCoverLetterByIdQuery(string Id) : IQuery<CoverLetterResponse>;
