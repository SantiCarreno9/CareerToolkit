using System.Security.Claims;

namespace Infrastructure.Authentication;

internal static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal? principal)
    {
        string? userId = principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        if(string.IsNullOrEmpty(userId))
        {
            throw new ApplicationException("User id is unavailable");
        }
        return userId;            
    }
}
