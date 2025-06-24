export class PagedList<T>
{
    constructor(public items: T[],
        public page: number,
        public pageSize: number,
        public totalCount:number,
        public totalNumberOfPages:number)
    {

    }
}