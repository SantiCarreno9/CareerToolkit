using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Users;
public class UserDb : IdentityUser
{
    public string FullName { get; set; }
    public string? Address { get; set; }
    public string? AdditionalContactInfo { get; set; }
}
