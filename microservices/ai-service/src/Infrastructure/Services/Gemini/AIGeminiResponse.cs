namespace Infrastructure.Services.Gemini;
public class AiResponse
{
    public List<AiContentContainer> Candidates { get; set; }
}

public class AiContentContainer
{
    public AiContent Content { get; set; }
}

public class AiContent
{
    public List<AiPart> Parts { get; set; }
    public string Role { get; set; }
}
