using FluentValidation;

namespace Module.Resumes.Application.ProfileEntries.Delete;
internal sealed class DeleteProfileEntryCommandValidator : AbstractValidator<DeleteProfileEntryCommand>
{
    public DeleteProfileEntryCommandValidator()
    {
        RuleFor(c => c.EntryId).NotEmpty();
    }
}
