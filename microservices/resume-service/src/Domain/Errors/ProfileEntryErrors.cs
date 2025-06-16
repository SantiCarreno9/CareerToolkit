using SharedKernel;

namespace Domain.Errors;

public static class ProfileEntryErrors
{
    public static Error NotFound(string entryId) => Error.NotFound(
    "ProfileEntry.NotFound",
    $"The entry with the Id = '{entryId}' was not found");

    public static Error Unauthorized() => Error.Unathorized(
        "ProfileEntry.Unauthorized",
        "You are not authorized to perform this action.");

}
