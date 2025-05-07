using Microsoft.AspNetCore.Identity;

namespace UserService.Domain.Entities
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }        
        public string? Address { get; set; }        
        public string? AdditionalContactInfo { get; set; }
    }
}
