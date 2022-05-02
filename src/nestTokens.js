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
    //栈结构，先入后出，先push，后pop
    //这块最精妙的是对象的引用，引用向上一级一级传递改变，先令collector=nestTokens，引用指向最高级，遇不到#就一直最高级外层push
    // default: collector.push(token)，当遇到#时，先collector.push(token)，给最高级外层push一个最新的[# students]
    //**最关键的来了***，然后section用于栈记录第二级，同时改变了collector的引用给了一个新的身份，
    //指向第二级数组集合就变成了[# students [collector]]，
    //nestTokens[[#,students,[xxx,xxx,xxx]]=section[0][2]=token[2]=collector=[]，
    //这块形成了一个引用传递链最外层的也随之改变，然后遇到/ 就把section一pop清空，collector再指挥最外层nestTokens又开始一下一个循环