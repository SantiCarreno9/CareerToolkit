using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;

namespace Application.ProfileEntries.Create;
public class CreateProfileEntryCommand : BaseProfileEntryCommand, ICommand<string>
{
    //public string UserEmail { get; set; }
}
