namespace Domain.Extensions;
public static class ConversionExtensions
{
    public static Dictionary<string, string> ConvertToDictionary(this string? jsonString)
    {
        if (string.IsNullOrEmpty(jsonString))
        {
            return new Dictionary<string, string>();
        }
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(jsonString) ?? new Dictionary<string, string>();
        }
        catch (System.Text.Json.JsonException)
        {
            return new Dictionary<string, string>();
        }
    }

    public static string ConvertToJson(this Dictionary<string, string> dictionary)
    {
        if (dictionary == null || dictionary.Count == 0)
        {
            return string.Empty;
        }
        try
        {
            return System.Text.Json.JsonSerializer.Serialize(dictionary);
        }
        catch (System.Text.Json.JsonException)
        {
            return string.Empty;
        }
    }
}
