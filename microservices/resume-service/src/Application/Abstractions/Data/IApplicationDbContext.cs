using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions.Data;
public interface IApplicationDbContext
{
    DbSet<ProfileEntry> ProfileEntries { get; }    
    DbSet<Resume> Resumes { get; }    
    DbSet<CoverLetter> CoverLetters { get; }    

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
