using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.ProfileEntries.Shared;
using Domain.Entities;

namespace Application.Extensions;
internal static class ProfileEntryConversions
{
    public static ProfileEntryResponse ToResponse(this ProfileEntry profileEntry)
    {
        return new ProfileEntryResponse(
            profileEntry.Id,
            profileEntry.Category,
            profileEntry.Title,
            profileEntry.Organization,
            profileEntry.Location,
            profileEntry.StartDate,
            profileEntry.EndDate,
            profileEntry.IsCurrent,
            profileEntry.Description
            );
    }

    public static List<ProfileEntryResponse> ToResponse(this List<ProfileEntry> profileEntry)
    {
        var entriesResponse = new List<ProfileEntryResponse>();
        foreach (ProfileEntry entry in profileEntry)
        {
            entriesResponse.Add(entry.ToResponse());
        }
        return entriesResponse;
    }
}
