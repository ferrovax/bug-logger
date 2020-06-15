const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const connectDB = require('./config/db');
const Log = require('./models/Log');

const isMac = process.platform === 'darwin';

let isDev = false;
if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
	isDev = true;
}

let mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		show: false,
		icon: './assets/icons/icon.png',
		webPreferences: {
			nodeIntegration: true,
		},
	});

	let indexPath;

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		});
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		});
	}

	mainWindow.loadURL(indexPath);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		// Open devtools if in development
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer');

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			);
			mainWindow.webContents.openDevTools();
		}
	})

	mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
	createMainWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow();
	}
})

// Menu specifications
const menu = [
	...(isMac ? [{ role: 'appMenu' }] : []),
	{
		role: 'fileMenu'
	},
	{
		role: 'editMenu'
	},
	{
		label: 'Logs',
		submenu: [
			{
				label: 'Clear Logs',
				click: () => clearLogs()
			}
		]
	},
	...(isDev ? [
		{
			label: 'Developer',
			submenu: [
				{ role: 'reload' },
				{ role: 'forcereload' },
				{ type: 'separator' },
				{ role: 'toggledevtools' }
			]
		}
	] : [])
];

// Stop error
app.allowRendererProcessReuse = true;

/*
																		BACKEND
================================================================================

*/

let user;

// Login attempted, connect to database
ipcMain.on('login:try', async (e, username, password) => {
	const login = await connectDB(username, password);

	if (login) {
		user = username;
		mainWindow.webContents.send('username', user);
	}

	e.reply('login:result', login);
});

// Load logs
ipcMain.on('logs:load', sendLogs);

// Add log
ipcMain.on('logs:add', async (e, item) => {
	try {
		await Log.create({...item, user});
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Add tag
ipcMain.on('tags:add', async (e, tag, id) => {
	try {
		const doc = await Log.findById(id);
		let _tags = [...doc.tags, tag];

		await Log.updateOne(
			{ _id: id },
			{ $set: { tags: _tags } }
		);
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Edit log
ipcMain.on('logs:edit', async (e, item) => {
	try {
		const doc = await Log.findById(item.id);

		doc.text = doc.text !== item.text ? item.text : doc.text;
		doc.priority = doc.priority !== item.priority ? item.priority : doc.priority;
		doc.created = Date.now();

		await doc.save();
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Move log (to another Kolumn)
ipcMain.on('logs:move_log', async (e, draggableId, droppableId) => {
	try {
		const doc = await Log.findById(draggableId);
		doc.category = droppableId;
		await doc.save();
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Delete log
ipcMain.on('logs:delete', async (e, id) => {
	try {
		await Log.findOneAndDelete({ _id: id });
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Delete tag
ipcMain.on('tags:delete', async (e, tag, id) => {
	try {
		const doc = await Log.findById(id);
		let _tags = doc.tags.filter(t => t !== tag);

		await Log.updateOne(
			{ _id: id },
			{ $set: { tags: _tags } }
		);
		sendLogs();
	} catch (err) {
		console.log(err);
	}
});

// Search
ipcMain.on('logs:search', async (e, terms) => {
	try {
		const logs = await Log.find({ text: terms });
		console.log(logs);
		mainWindow.webContents.send('logs:get', JSON.stringify(logs));
	} catch (err) {
		console.log(err);
	}
});

// Clear logs
async function clearLogs() {
	try {
		await Log.deleteMany({});
		mainWindow.webContents.send('logs:clear');
	} catch (e) {
		console.log(e);
	}
}

// Send logs to frontend (App.js)
async function sendLogs() {
	try {
		const logs = await Log.find().sort({ created: -1 });
		mainWindow.webContents.send('logs:get', JSON.stringify(logs));
	} catch (e) {
		console.log(e);
	}
}
