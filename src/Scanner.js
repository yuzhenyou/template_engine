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