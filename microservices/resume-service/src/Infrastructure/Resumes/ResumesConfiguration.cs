using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Resumes;
internal sealed class ResumesConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id)
            .ValueGeneratedNever()
            .HasMaxLength(450);

        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(r => r.UserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(r => r.UserInfo)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<UserInfo>(v, (JsonSerializerOptions)null));

        builder.Property(r => r.ProfileEntries)
            .HasColumnType("jsonb")
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<ProfileEntry>>(v, (JsonSerializerOptions)null));

        //builder.Property(r => r.Keywords)
        //    .HasColumnType("text");
        //builder.property(r => r.keywords)
        //    .hascolumntype("jsonb")
        //    .hasconversion(
        //        v => jsonserializer.serialize(v, (jsonserializeroptions)null),
        //        v => jsonserializer.deserialize<list<string>>(v, (jsonserializeroptions)null));

        builder.HasIndex(r => new { r.Name, r.Keywords, r.JobPosting })
            .HasMethod("GIN")
            .IsTsVectorExpressionIndex("english");
    }
}
