using Microsoft.EntityFrameworkCore;

namespace Application.Abstractions;
public class PagedList<T>
{
    public PagedList(List<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalNumberOfPages = totalCount != pageSize ? (int)MathF.Ceiling((float)totalCount / pageSize) : 1;
    }
    public List<T> Items { get; }
    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public int TotalNumberOfPages { get; }
    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 1;

    public static async Task<PagedList<T>> CreateAsync(IQueryable<T> query, int page, int pageSize)
    {
        int totalCount = await query.CountAsync();
        List<T> items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new(items, page, pageSize, totalCount);
    }

    public static PagedList<T> Create(IQueryable<T> query, int page, int pageSize)
    {
        int totalCount = query.Count();
        var items = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new(items, page, pageSize, totalCount);
    }
}
