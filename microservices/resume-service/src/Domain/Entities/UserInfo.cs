using SharedKernel;

namespace Domain.Entities;

public class UserInfo
{    
    public string FullName { get; set; }
    public string Email { get; set; }    
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public Dictionary<string, string> AdditionalContactInfo { get; set; } = [];
}
