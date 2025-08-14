using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Module.Resumes.Application.Resumes.Shared;
using SharedKernel.Application.Abstractions.Messaging;

namespace Module.Resumes.Application.Resumes.GetById;
public sealed record GetResumeByIdQuery(string Id) : IQuery<ResumeResponse>;
