using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Application.Abstractions.AIService;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Services.Gemini;
internal class GeminiService : IAIService
{
    private readonly string baseURL;
    private readonly HttpClient httpClient;
    private readonly ILogger<GeminiService> logger;

    public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
    {
        string geminiEndpoint = configuration["Gemini:Endpoint"];
        string apiKey = configuration["Gemini:ApiKey"];
        baseURL = geminiEndpoint + apiKey;
        this.httpClient = httpClient;
        this.logger = logger;
    }

    protected async Task<T> BaseRequest<T>(Task<HttpResponseMessage> request)
    {
        try
        {                        
            HttpResponseMessage response = await request;
            if (response.IsSuccessStatusCode)
            {                
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    return default;
                }
                logger.LogInformation("Request Response:{Response}", await response.Content.ReadAsStringAsync());
                AiResponse aiResponse = await response.Content.ReadFromJsonAsync<AiResponse>();
                object content = aiResponse.Candidates[0].Content.Parts[0].Text;

                if (typeof(T) == typeof(string))
                {
                    return (T)content;
                }
                string contentStr = content.ToString();
                if (string.IsNullOrEmpty(contentStr))
                {
                    return default;
                }
                return JsonSerializer.Deserialize<T>(contentStr);
            }
            else
            {
                string message = await response.Content.ReadAsStringAsync();
                logger.LogError(message);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex,"Post request response:");
        }
        return default;
    }

    protected async Task<T> Post<T>(AiRequest request)
    {
        logger.LogInformation("Post request: {Request}",JsonSerializer.Serialize(request));
        return await BaseRequest<T>(httpClient.PostAsJsonAsync(baseURL, request));
    }

    public async Task<T> GenerateText<T>(InstructionToAi instruction)
    {
        var request = AiRequest.CreateRequest<T>(instruction.Prompt, instruction.Instruction);
        return await Post<T>(request);
    }

}
