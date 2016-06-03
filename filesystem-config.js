import path from 'path'
import electron from 'electron'

// todo: fix the below, they're electron-specific

const filename = electron.remote.getCurrentWindow().getFilename()


__dirname = path.resolve(__dirname, '../../../../../../', filename.split('/').slice(0, -1).join('/'))
__filename = path.resolve(__dirname, '../../../../../../', filename)

