using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infrastructure.ProfileEntries;
internal sealed class ProfileEntryConfiguration : IEntityTypeConfiguration<ProfileEntry>
{
    public void Configure(EntityTypeBuilder<ProfileEntry> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
            .ValueGeneratedNever()
            .HasMaxLength(450);

        builder.Property(u => u.Title)
            .HasMaxLength(100);
        builder.Property(u => u.Organization)
            .HasMaxLength(256);
        builder.Property(u => u.Location)
            .HasMaxLength(256);        
    }
}
