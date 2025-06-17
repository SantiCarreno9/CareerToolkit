export class HelperMethods
{
    public static convertDateToDateOnlyString(date: Date): string
    {
        return date.toISOString().slice(0, 10);
    }

    public static cleanHtmlString(htmlString: string): string
    {
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

}