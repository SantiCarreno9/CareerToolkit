export class HelperMethods{
    public static convertDateToDateOnlyString(date:Date):string{
        return date.toISOString().slice(0, 10);
    }

    public static cleanHtmlString(htmlString: string): string {                
        return htmlString.replace(/&nbsp;/g, ' ');
    }
}