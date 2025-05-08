namespace UserService.Application.DTOs.Requests
{
   public record PersonalDetailsRequest(        
        string FullName,        
        string PhoneNumber,
        string Address,
        string AdditionalContactInfo
    );
}
