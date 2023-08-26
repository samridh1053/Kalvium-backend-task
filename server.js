const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

const HISTORY_FILE = './history.json';

let history = [];

// Load history from file if exists
if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Math Operation Server</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
                color: #333;
            }
            h2 {
                color: #444;
            }
            a {
                text-decoration: none;
                color: #007BFF;
            }
            a:hover {
                text-decoration: underline;
            }
            .instructions {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
        </style>
        </head>
        <body>
            <h2>Math Operation Server</h2>
            <div class="instructions">
            <p>Click on the links below for sample operations:</p>
            <div><a href="/5/plus/3">5 + 3</a></div>
            <div><a href="/3/minus/5">3 - 5</a></div>
            <div><a href="/3/minus/5/plus/8">3 - 5 + 8</a></div>
            <div><a href="/3/into/5/plus/8/into/6">3 * 5 + 8 * 6</a></div>
            <div><a href="/5/mod/3">5 % 3</a></div>
            <div><a href="/10/divide/2">10 / 2</a></div>
            <div><a href="/2/power/3">2 ^ 3</a></div>

            <br>
            <p><strong>How to use:</strong></p>
            <p>
                You can create your own mathematical operations by composing the URL. Use numbers combined with the following operations: <code>plus</code>, <code>minus</code>, and <code>into</code>.
            </p>
            <p>For example, for the operation 2 + 3, use: <a href="/2/plus/3">/2/plus/3</a></p>
            </div>
            <h2>History</h2>
            <div class="history">
                <a href="/history">View History</a> | <a href="/clear-history">Clear History</a> | <a href="/average">Calculate Average</a>
            </div>
        </body>
        </html>
    `);
});

app.get('/history', (req, res) => {
    const historyTable = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Math Operation Server - History</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    background-color: #f4f4f4;
                    color: #333;
                }
                h2 {
                    color: #444;
                }
                a {
                    text-decoration: none;
                    color: #007BFF;
                }
                a:hover {
                    text-decoration: underline;
                }
                .history {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                tr:nth-child(even) {
                    background-color: #e0e0e0;
                }
            </style>
        </head>
        <body>
            <h2>History</h2>
            <div class="history">
                <a href="/">Go Back</a>
                <table>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                    </tr>
                    ${history.map(entry => `<tr><td>${entry.question}</td><td>${entry.answer}</td></tr>`).join('')}
                </table>
            </div>
        </body>
        </html>
    `;
    res.send(historyTable);
});



app.get('/clear-history', (req, res) => {
    history = [];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
    res.redirect('/history');
});

app.get('/average', (req, res) => {
    const sum = history.reduce((total, entry) => total + entry.answer, 0);
    const average = sum / history.length || 0;
    res.send(`Average of calculated results: ${average}`);
});

app.get('/*', (req, res) => {
    if (req.url === '/favicon.ico') {
        return res.status(204).end();
    }
    const parts = req.path.substring(1).split('/');
    if (parts.length % 2 === 0) {
        return res.status(400).send({ error: 'Incomplete operation. Please provide a valid sequence of numbers and operators.' });
    }

    let result = parseInt(parts[0]);
    let question = parts[0];

    for (let i = 1; i < parts.length; i += 2) {
        const operator = parts[i];
        const operand = parseInt(parts[i + 1]);

        question += operatorSymbol(operator) + operand;

        switch (operator) {
            case 'plus':
                result += operand;
                break;
            case 'minus':
                result -= operand;
                break;
            case 'into':
                result *= operand;
                break;
            case 'mod': // New operation: Modulus
                result %= operand;
                break;
            case 'divide': // New operation: Division
                if (operand !== 0) {
                    result /= operand;
                } else {
                    res.status(400).send({ error: 'Division by zero.' });
                    return;
                }
                break;
            case 'power': // New operation: Exponentiation
                result **= operand;
                break;
            default:
                res.status(400).send({ error: 'Invalid operator: ' + operator });
                return;
        }
    }

    const response = {
        question: question.replace(/plus/g, '+').replace(/minus/g, '-').replace(/into/g, '*').replace(/mod/g, '%').replace(/divide/g, '/').replace(/power/g, '^'),
        answer: result
    };
    

    history.push(response);

    if (history.length > 20) {
        history.shift();
    }

    // Save the history
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));

    res.json(response);
});


function operatorSymbol(op) {
    switch (op) {
        case 'plus':
            return '+';
        case 'minus':
            return '-';
        case 'into':
            return '*';
        case 'mod':
            return '%';
        case 'divide':
            return '/';
        case 'power':
            return '^';
        default:
            return '';
    }
}

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
