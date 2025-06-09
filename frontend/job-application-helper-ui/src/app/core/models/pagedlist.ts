export class PagedList<T>
{
    constructor(public items: T[],
        public page: number,
        public pageSize: number)
    {

    }
}