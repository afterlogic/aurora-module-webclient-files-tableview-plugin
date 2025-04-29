'use strict'

const
    Settings = require('modules/%ModuleName%/js/Settings.js'),
    Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
    Utils = require('%PathToCoreWebclientModule%/js/utils/Common.js'),
    FilesTableviewSettingsFormView = require('modules/%ModuleName%/js/views/FilesTableviewSettingsFormView.js')
;

/**
 * @constructor
 */
function CToggleFilesButtonView()
{
	this.tableView = Settings.enableModule
}

function onChangeFilesViewType(isTable = false) {
    if (Settings.enableModule() !== isTable) {
        Settings.enableModule(isTable)
        FilesTableviewSettingsFormView.enableModule(isTable)

        Ajax.send('%ModuleName%', 'UpdateSettings', {
            'EnableModule': isTable
        })
    }
}

CToggleFilesButtonView.prototype.ViewTemplate = '%ModuleName%_ToggleFilesButtonView'

CToggleFilesButtonView.prototype.useFilesViewData = function () {
	this.useGridFilesViewCommand = Utils.createCommand(this, () => onChangeFilesViewType())
	this.useListFilesViewCommand = Utils.createCommand(this, () => onChangeFilesViewType(true))
}

module.exports = new CToggleFilesButtonView()