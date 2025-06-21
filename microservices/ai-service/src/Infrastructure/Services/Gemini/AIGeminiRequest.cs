using System.IO;

namespace Infrastructure.Services.Gemini;
public class AiRequest
{
    public AiPartContainer? SystemInstruction { get; set; }
    public List<AiPartContainer> Contents { get; set; }
    public AiSOResponseContainer? GenerationConfig { get; set; }

    public static AiRequest CreateRequest(string prompt)
    {
        return new AiRequest
        {
            Contents = new List<AiPartContainer>
            {
                new AiPartContainer
                {
                    Parts = new List<AiPart>
                    {
                        new AiPart
                        {
                            Text = prompt
                        }
                    }
                }
            }
        };
    }

    public static AiRequest CreateRequest(string prompt, string instructions)
    {
        AiRequest aiRequest = CreateRequest(prompt);
        aiRequest.SystemInstruction = new AiPartContainer
        {
            Parts = new List<AiPart>
                {
                    new AiPart
                    {
                        Text = instructions
                    }
                }
        };
        return aiRequest;
    }

    public static AiRequest CreateRequest<T>(string prompt, string? instructions)
    {
        AiRequest request = instructions != null ? CreateRequest(prompt, instructions) : CreateRequest(prompt);
        if (typeof(T).IsAssignableFrom(typeof(List<string>)))
        {
            request.GenerationConfig = new AiSOResponseContainer
            {
                ResponseSchema = new AiSOArray
                {
                    Items = new AiSOResponseSchema
                    {
                        Type = "STRING"
                    }
                }
            };
        }
        return request;
    }
}

public class AiPartContainer
{
    public List<AiPart> Parts { get; set; }
}

public class AiPart
{
    public object Text { get; set; }
}

public class AiSOResponseContainer
{
    public string ResponseMimeType { get; set; } = "application/json";
    public object ResponseSchema { get; set; }
}

public class AiSOResponseSchema
{
    public string Type { get; set; }
}

public class AiSOArray : AiSOResponseSchema
{
    public AiSOResponseSchema Items { get; set; }
    public AiSOArray()
    {
        Type = "ARRAY";
    }
}

public class AiSOObject : AiSOResponseSchema
{
    public AiSOResponseSchema Properties { get; set; }
}
