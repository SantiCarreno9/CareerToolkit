using SharedKernel;

namespace Domain.Errors;
public static class CoverLetterErrors
{
    public static Error NotFound(string coverLetterId) => Error.NotFound(
        "CoverLetter.NotFound",
        $"The cover letter with the Id = '{coverLetterId}' was not found");

    public static Error Unauthorized() => Error.Unathorized(
        "CoverLetter.Unauthorized",
        "You are not authorized to perform this action.");
}
