using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;

namespace Application.Users.UpdatePersonalInfo;
public sealed record UpdatePersonalInfoCommand(string Id, string FullName, string Address, string PhoneNumber, Dictionary<string,string> AdditionalContactInfo)
    : ICommand;
