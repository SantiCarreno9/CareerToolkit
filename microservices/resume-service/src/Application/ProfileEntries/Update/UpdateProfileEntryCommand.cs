using Application.Abstractions.Messaging;
using Application.ProfileEntries.Shared;

namespace Application.ProfileEntries.Update;
public class UpdateProfileEntryCommand : BaseProfileEntryCommand, ICommand
{
    public string Id { get; set; }    
}
