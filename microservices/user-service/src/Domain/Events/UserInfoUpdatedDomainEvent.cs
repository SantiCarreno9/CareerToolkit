using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharedKernel;

namespace Domain.Events;
public sealed record UserInfoUpdatedDomainEvent(string UserId) : IDomainEvent;
