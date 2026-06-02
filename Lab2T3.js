const { Transform } = require('stream');

class UpperCaseStream extends Transform {
    _transform(chunk, encoding, callback) {
        const text = chunk.toString();
        let result = '';
        for (let char of text) {
            if (!/\d/.test(char)) {
                result += char.toUpperCase();
            } else {
                result += char;
            }
        }
        this.push('\n[UpperCaseStream] Результат:\n' + result);
        callback();
    }
}

class StatsStream extends Transform {
    _transform(chunk, encoding, callback) {
        const text = chunk.toString().trim();
        const charCount = text.length;
        const wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
        
        const result = `\n[StatsStream] Текст: ${text}\n[StatsStream] Статистика -> Слів: ${wordCount}, Символів: ${charCount}\n`;
        this.push(result);
        callback();
    }
}

class ColorStream extends Transform {
    constructor(keywordsMap, numberColor) {
        super();
        this.keywordsMap = keywordsMap; 
        this.numberColor = numberColor; 
        this.resetColor = '\x1b[0m';
    }

    _transform(chunk, encoding, callback) {
        let text = chunk.toString();

        text = text.replace(/\b(\d+)\b/g, `${this.numberColor}$1${this.resetColor}`);

        for (const [word, color] of Object.entries(this.keywordsMap)) {
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            text = text.replace(regex, `${color}$1${this.resetColor}`);
        }

        this.push(`\n[ColorStream] Результат:\n${text}`);
        callback();
    }
}

const keywords = {
    'error': '\x1b[31m',
    'success': '\x1b[32m',
    'info': '\x1b[34m'
};
const NUMBER_COLOR = '\x1b[33m';

const upperStream = new UpperCaseStream();
const statsStream = new StatsStream();
const colorStream = new ColorStream(keywords, NUMBER_COLOR);

console.log("Введіть текст у консоль (для перевірки 'info: 100 success, 1 error'):");

process.stdin.on('data', (data) => {
    upperStream.write(data);
    statsStream.write(data);
    colorStream.write(data);
});

upperStream.pipe(process.stdout);
statsStream.pipe(process.stdout);
colorStream.pipe(process.stdout);
