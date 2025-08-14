using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Users.Application.Users.UpdatePersonalInfo;
public sealed record UpdatePersonalInfoCommand(string Id, string FullName, string Address, string PhoneNumber, Dictionary<string,string> AdditionalContactInfo)
    : ICommand;
