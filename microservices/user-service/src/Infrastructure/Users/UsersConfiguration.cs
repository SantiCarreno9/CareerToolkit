using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Users;

namespace Infrastructure.ProfileEntries;
internal sealed class UsersConfiguration : IEntityTypeConfiguration<UserDb>
{
    public void Configure(EntityTypeBuilder<UserDb> builder)
    {
        builder.Property(u => u.FullName)
            .HasMaxLength(256);
        builder.Property(u => u.Address)
            .HasMaxLength(450);        
    }
}
