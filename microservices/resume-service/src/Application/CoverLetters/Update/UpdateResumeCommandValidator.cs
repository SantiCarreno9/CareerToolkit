﻿using FluentValidation;

namespace Application.CoverLetters.Update;
internal sealed class UpdateCoverLetterCommandValidator : AbstractValidator<UpdateCoverLetterCommand>
{
    public UpdateCoverLetterCommandValidator()
    {
        RuleFor(x=>x.Name)
            .NotEmpty()
            .WithMessage("Name is required.");
        RuleFor(x => x.UserInfo)
            .NotNull()
            .WithMessage("UserInfo is required.");
        RuleFor(x => x.ProfileEntries)
            .NotEmpty()
            .WithMessage("At least one profile entry is required.");       
    }
}
