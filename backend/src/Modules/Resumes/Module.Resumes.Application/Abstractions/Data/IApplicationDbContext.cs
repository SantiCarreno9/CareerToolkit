using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Module.Resumes.Domain.Entities;

namespace Module.Resumes.Application.Abstractions.Data;
public interface IApplicationDbContext
{
    DbSet<ProfileEntry> ProfileEntries { get; }    
    DbSet<Resume> Resumes { get; }    
    DbSet<CoverLetter> CoverLetters { get; }    

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
