console.log('webpack-dev-server is running!');

import Scanner from "./Scanner";
import parseTemplateToTokens from "./parseTemplateToTokens";
import renderTemplate from "./renderTemplate";

window.render = (template, data) => {

    let tokens = parseTemplateToTokens(template, data);

    let dom = renderTemplate(tokens, data);

    console.log('dom:  %c%s', 'color: blue;', dom);
    return dom;

}