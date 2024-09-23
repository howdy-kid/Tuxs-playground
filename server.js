//just my remote desktop shell so i can control the servers anywhere (aka school)

const express = require('express');
const { Server } = require('ws');
const pty = require('node-pty');
const path = require('path');

const app = express();
const port = 3000; 

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    const shell = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env,
    });

    shell.on('data', (data) => {
        ws.send(data);
    });

    ws.on('message', (message) => {
        shell.write(message);
    });

    ws.on('resize', (size) => {
        shell.resize(size.cols, size.rows);
    });

    ws.on('close', () => {
        shell.kill();
        console.log('Client disconnected');
    });
});
// RAHHHH!!!!!!!!!!!
