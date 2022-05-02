### 基于mustache模板引擎的核心实现

##### 一、安装与启动

1.安装

```
npm install
```

2.启动  http://localhost:8080/

```
npm run serve     
```

##### 二、核心实现与使用

***index.html***  html调用

```
body>

    <div id="app"></div>
    
    <script>
    
    let template = `
        <div class="container">
            {{#showTitle}}
                <h5 class="title">Title：{{title}}</h5>
            {{/showTitle}}
            {{#showType}}
                <ul class="type">
                    {{#type}}
                        <li class="li">{{.}}</li>
                    {{/type}}
                </ul>
            {{/showType}}
            <ol class="type">
                {{#type}}
                    <li class="li">{{.}}</li>
                {{/type}}
            </ol>
        </div>
    `;

    let data = {
        title: "人物统计表",
        showTitle: true,
        showType: false,
        type: ["类别1", "类别2"],
        num: 2,
        arr: [
            { name: "张三", age: 30, num: [60, 70] },
            { name: "李四", age: 40, num: [20, 30] }
        ]
    };

    let dom = render(template, data);
    document.querySelector('#app').innerHTML = dom;
    
    </script>
    
</body>
```

***index.js*** 全局入口

```
import Scanner from "./Scanner";
import parseTemplateToTokens from "./parseTemplateToTokens";
import renderTemplate from "./renderTemplate";

window.render = (template, data) => {

    let tokens = parseTemplateToTokens(template, data);
    let dom = renderTemplate(tokens, data);

    console.log('dom:  %c%s', 'color: blue;', dom);
    
    return dom;

}
```

***Scanner.js*** **核心类**，提供模板索引功能

```
export default class Scanner {
    constructor(template) {
        this.template = template;
        this.pos = 0;
        this.tail = template;
    }
    
    scan(tag) {
        if (this.tail.indexOf(tag) == 0) {
            this.pos += tag.length;
            this.tail = this.template.substring(this.pos);
        }
    }

    scanUntil(stopTag) {
        let startPos = this.pos;
        while (!this.eos() && this.tail.indexOf(stopTag)) {
            this.pos++;
            this.tail = this.template.substring(this.pos);
        }
        return this.template.substring(startPos, this.pos);
    }

    eos() {
        return this.pos >= this.template.length;

    }

}
```

***parseTemplateToTokens.js*** **核心转换** 模板转换成tokens，初步处理使用nestTokens.js二次转换

```
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
```

***nestTokens.js*** **tokens处理返回最终格式**

```
export default function nestTokens(tokens) {

    let nestedTokens = [];
    let collector = nestedTokens;
    let arr = [];

    for (let i = 0; i < tokens.length; i++) {

        let token = tokens[i]

        switch (token[0]) {
            case '#':
                collector.push(token);
                arr.push(token);
                collector = token[2] = [];
                break;
            case '/':
                arr.pop();
                collector = arr.length > 0 ? arr[arr.length - 1][2] : nestedTokens;
                break;
            default:
                collector.push(token);
        }

    }

    return nestedTokens;
}
```

***lookup.js*** 数据查找，获取查找数据属性

```
export default function lookup(obj, keyName) {

    let splitArr = [];
    let temp = obj;

    if (keyName.indexOf('.') != -1) {
    
        splitArr = keyName.split('.');
        
        for (let i = 0; i < splitArr.length; i++) {

            temp = temp[splitArr[i]];
        }
        return temp;
    }
    return obj[keyName];

}
```

***renderTemplate.js***  **数据模板整合核心**，将模板格式和数据最终整合，返回dom

```
import lookup from "./lookup";
import parseArray from "./parseArray";

export default function renderTemplate(tokens, data) {
    let result = '';
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];

        if (token[0] == 'text') {

            result += token[1];

        } else if (token[0] == 'name') {
            //lookup解决a.b.c的数据格式
            //name可能存在是.的情况，单纯遍历直接返回结果

            if (token[1] == '.') {
                result += data;
            } else {
                result += lookup(data, token[1]);
            }

        } else if (token[0] == '#') {
            //判断[#,show,[xxx]]类型，token[1]可能为布尔值;直接递归调用

            let bool = lookup(data, token[1]);

            if (typeof bool == 'boolean' && bool) {
                result += renderTemplate(token[2], data);
            } else {
                result += parseArray(token, data);
            }

        }
    }
    
    return result;
}
```

