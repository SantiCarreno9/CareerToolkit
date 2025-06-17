using Application.Abstractions.AIService;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SharedKernel;

namespace Infrastructure.Services.Gemini;
internal class GeminiResumeService : BaseGeminiService, IAiResumeService
{
    public GeminiResumeService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiResumeService> logger) : base(httpClient, configuration, logger)
    {
    }

    public async Task<Result<List<string>>> SelectExperienceEntries(ResumeInstruction instruction, List<ExperienceEntry> experienceEntries)
    {
        string prompt = "I'm applying for the following job. First, read the job posting carefully. Then, I will send you all of my experience entries, each one has its id.";
        prompt += "\n Please select around 5 entries and give me the list of the ids of the experience entries that are the most relevant to the job requirements";
        foreach (ExperienceEntry item in experienceEntries)
        {
            prompt += $"\nid:{item.Id} - Position: {item.Title} - with tasks: {item.Description}";
        }
        string instructionText = "Select the ones that are the most relevant to the job, and return the ids along with the reason why you picked it separated by a comma." + instruction.Instruction;
        var request = AiRequest.CreateRequest(prompt,instructionText);
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

        return await Post<List<string>>(request);
    }

    public async Task<List<string>> TailorExperienceEntry(ResumeInstruction instruction, ExperienceEntry experienceEntry)
    {
        string prompt = "I'm applying for the following job. First, read the job posting carefully. Then, I will send you one project or job description from my resume.";
        //string instructionText = "Read the job posting first.\r\nThen I’ll send you one of my past jobs or projects.\r\nKeep only the parts that match what the job is asking for.\r\nWrite the result as 3–5 bullet points.\r\nKeep it clear, short, and professional — no fancy words.";
        string instructionText = "Keep the writing clear, short, and professional. Don’t use fancy words. Around 3-4 short items. Always try to highlight keywords. " + instruction.Instruction;
        switch (instruction.AiInstructionType)
        {
            case AiInstruction.Generate:
                break;
            case AiInstruction.Tailor:
                prompt += $"\n Your task is to tailor it by selecting only the most relevant tasks and responsibilities that align with the job requirements.\r\n\r\nFocus on:\r\n\r\nTechnologies, tools, and methods listed in the job post.";
                break;
            case AiInstruction.Improve:
                prompt += $"\n Please improve the grammar and flow of the following job tasks from my experience";
                break;
            case AiInstruction.Custom:
                prompt += instruction.Instruction;
                instructionText = "";
                break;
        }

        prompt += $"\r\n\r\nHere’s the job posting: {instruction.JobPosting}";
        prompt += $"Here is one of my project/job descriptions:{experienceEntry.Description}";

        var request = AiRequest.CreateRequest(prompt, instructionText);
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

        return await Post<List<string>>(request);
    }

    public async Task<List<string>> TailorSection(ResumeInstruction instruction, string SectionContent)
    {
        string prompt = $"I'm applying for the following job. {instruction.JobPosting}";
        prompt += $"\n{instruction.Instruction}";

        var request = AiRequest.CreateRequest(prompt);
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

        return await Post<List<string>>(request);
    }

    public async Task<List<string>> TailorSummary(ResumeInstruction instruction, List<ExperienceEntry> experienceEntries, string? currentSummary)
    {
        string prompt = "I'm applying for the following job. First, read the job posting carefully.\n Then I will send you all my experience.";
        string instructionText = "Keep the writing clear, short, and professional. Don’t use fancy words. Around 3-4 short items. Always try to highlight keywords." + instruction.Instruction;
        switch (instruction.AiInstructionType)
        {
            case AiInstruction.Generate:
                prompt += "\r\nUse it to create a Summary section for my resume that matches what this job is asking for.";
                break;
            case AiInstruction.Tailor:
                prompt += $"\n Then I’ll send you my summary section. Your task is to rewrite it so it matches what this job is looking for according to my previous experience.";
                break;
            default:
                break;
        }
        prompt += $"\r\n\r\nHere’s the job posting: {instruction.JobPosting}";
        prompt += "\n Here’s my experience. Please use only what’s relevant to the job above and turn it into a resume summary";
        foreach (ExperienceEntry item in experienceEntries)
        {
            prompt += $"\n{item.Title} - with tasks: {item.Description}";
        }
        switch (instruction.AiInstructionType)
        {
            case AiInstruction.Tailor:
                prompt += $"\n Here’s my current summary: {currentSummary}";
                break;
            case AiInstruction.Improve:
                prompt += $"\n Please improve the grammar and flow of the following summary of my experience and skills";
                break;
            case AiInstruction.Custom:
                prompt = instruction.Instruction;
                instructionText = "";
                break;
            default:
                break;
        }

        var request = AiRequest.CreateRequest(prompt, instructionText);
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

        return await Post<List<string>>(request);
    }
}
