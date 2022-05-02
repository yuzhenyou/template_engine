import Scanner from "./Scanner";
import nestTokens from "./nestTokens";

export default function parseTemplateToTokens(template) {

    let scanner = new Scanner(template);
    let tokens = [];
    let result;

    while (!scanner.eos()) {

        result = scanner.scanUntil("{{");

        if (result != '') {
            tokens.push([
                'text', result.replace(/\s{1,}(<)|(>)\s{1,}/g, '$1$2')
            ]);
        }

        scanner.scan("{{");

        result = scanner.scanUntil("}}");

        if (result != '') {
            if (result[0] == '#') {

                result = result.substring(1);
                tokens.push([
                    '#', result
                ]);

            } else if (result[0] == '/') {

                result = result.substring(1);
                tokens.push([
                    '/', result
                ]);
                
            } else {

                tokens.push([
                    'name', result
                ]);
            }

        }

        scanner.scan("}}");
    }

    return nestTokens(tokens);
    
}