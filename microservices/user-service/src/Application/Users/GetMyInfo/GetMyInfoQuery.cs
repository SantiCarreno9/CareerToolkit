using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Users.Shared;

namespace Application.Users.GetMyInfo;
public sealed record GetMyInfoQuery : IQuery<UserResponse>;
