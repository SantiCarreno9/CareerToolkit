﻿using FluentValidation;

namespace Application.ProfileEntries.Create;
internal sealed class CreateProfileEntryCommandValidator : AbstractValidator<CreateProfileEntryCommand>
{
    public CreateProfileEntryCommandValidator()
    {        
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required.");
        RuleFor(x => x.StartDate)
            .NotEmpty()
            .WithMessage("StartDate is required.");
        RuleFor(x => x.Category)
            .IsInEnum()
            .WithMessage("Category is invalid.");
        RuleFor(x => x.EndDate)
            .GreaterThan(x => x.StartDate)
            .When(x => x.EndDate.HasValue)
            .WithMessage("EndDate must be greater than StartDate.");
    }
}
