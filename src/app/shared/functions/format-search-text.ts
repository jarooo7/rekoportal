export function getFormatedSearch(text: string): string {
    const temp = text.split('');
    let textResult: string;
    textResult = '';
    temp.forEach(a => {
        textResult = textResult.concat(changeChar(a));
    });
    return textResult;
}

function changeChar(e: string) {
    switch (e) {
        case 'ę': {
           return 'e';
        }
        case 'ż': {
            return 'z';
        }
        case 'ź': {
            return 'z';
        }
        case 'ą': {
            return 'a';
        }
        case 'ł': {
            return 'l';
        }
        case 'ć': {
            return 'c';
        }
        case 'ś': {
            return 'c';
        }
        case 'ó': {
            return 'o';
        }
        case 'ń': {
            return 'n';
        }
        case ' ': {
            return '';
        }
        default: {
          return e;
        }
     }
}
