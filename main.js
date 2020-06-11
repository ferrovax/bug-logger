const path = require('path');
const url = require('url');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const connectDB = require('./config/db');
const Log = require('./models/Log');

// Connect to database
//connectDB();
let user;

// Login attempted
ipcMain.on('login:try', async (e, username, password) => {
	const login = await connectDB(username, password);

	if (login) {
		user = username;
	}

	e.reply('login:result', login);
});

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
		backgroundColor: 'white',
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
]

// Load logs
ipcMain.on('logs:load', sendLogs);

// Add log
ipcMain.on('logs:add', async (e, item) => {
	try {
		await Log.create({...item, user});
		sendLogs();
	} catch (e) {
		console.log(e);
	}
});

// Delete log
ipcMain.on('logs:delete', async (e, id) => {
	try {
		await Log.findOneAndDelete({ _id: id });
		sendLogs();
	} catch (e) {
		console.log(e);
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

//
async function sendLogs() {
	try {
		const logs = await Log.find().sort({ created: 1 });
		mainWindow.webContents.send('logs:get', JSON.stringify(logs));
	} catch (e) {
		console.log(e);
	}
}

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

// Stop error
app.allowRendererProcessReuse = true;
