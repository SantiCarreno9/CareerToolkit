using Module.Resumes.Application.ProfileEntries.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.ProfileEntries.Update;
public class UpdateProfileEntryCommand : BaseProfileEntryCommand, ICommand
{
    public string Id { get; set; }    
}
