using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Create;
public class CreateProfileEntryCommand : BaseProfileEntryCommand, ICommand<string>
{
    //public string UserEmail { get; set; }
}
