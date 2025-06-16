using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Users.IsAuthenticated;
public sealed record IsAuthenticatedResponse
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string FullName { get; init; }    
}
