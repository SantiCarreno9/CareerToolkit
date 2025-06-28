export class HelperMethods
{
    public static convertDateToDateOnlyString(date: Date): string
    {
        return date.toISOString().slice(0, 10);
    }

    public static cleanHtmlString(htmlString: string | null): string
    {
        if (htmlString === null)
            return '';
        return htmlString.replace(/&nbsp;/g, ' ');
    }

    public static convertToPlainText(htmlString: string): string
    {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent || tempElement.innerText || '';
    }

    public static convertPlainTextToHtml(plainText: string): string
    {
        if (!plainText) return '';

        // Convert **text** to <strong>text</strong>
        const boldConverted = plainText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Optional: Convert new lines to <br> if needed for HTML display
        const htmlFormatted = boldConverted.replace(/\n/g, '<br>');

        return htmlFormatted;
    }

    public static convertPlainTextArrayToHtml(plainTextArray: string[]): string
    {
        if (!plainTextArray || plainTextArray.length === 0) return '';

        if (plainTextArray.length === 1)
        {
            return this.convertPlainTextToHtml(plainTextArray[0]);
        }

        const listItems = plainTextArray.map(item => `<li>${this.convertPlainTextToHtml(item)}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    }

    public static getFormattedPhoneNumber(phoneNumber: string): string | null
    {
        let cleaned = ('' + phoneNumber).replace(/\D/g, '');

        let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        if (match)
        {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3]
        };
        return null
    }

    public static cleanTextForAI(input: string): string
    {
        return input
            // Replace \u00A0 (non-breaking spaces) with regular space
            .replace(/\u00A0/g, ' ')
            // Replace multiple newlines with a single newline
            .replace(/\n{2,}/g, '\n')
            // Trim leading/trailing whitespace
            .trim()
            // Optional: Replace tabs with single spaces
            .replace(/\t/g, ' ')
            // Optional: Remove excessive spaces
            .replace(/ +/g, ' ');
    }

    public static cleanUrl(url: string): string
    {
        let newUrl: string = url;
        if (url.includes('https://'))
        {
            newUrl = url.slice('https://'.length);
        } else if (url.includes('http://'))
        {
            newUrl = url.slice('http://'.length);
        }

        if (newUrl.includes('www.'))
        {
            newUrl = newUrl.slice('www.'.length);
        }
        return newUrl;
    }

    public static isNullOrEmpty(text?:string):boolean{
        return text===null || text===undefined || text.length==0 || text.trim()==='';
    }
}