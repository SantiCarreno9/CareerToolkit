namespace UserService.Application.DTOs.Responses
{
    public record PersonalDetailsResponse(
            string Id,
            string FullName,
            string Email,
            string PhoneNumber,
            string Address,
            string AdditionalContactInfo
        );
}
