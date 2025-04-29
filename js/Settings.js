'use strict';

var
	ko = require('knockout'),
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

module.exports = {
	ServerModuleName: '%ModuleName%',
	HashModuleName: 'files',
	
	/**
	 * Setting indicates if module is enabled by user or not.
	 * The Core subscribes to this setting changes and if it is **true** displays module tab in header and its screens.
	 * Otherwise the Core doesn't display module tab in header and its screens.
	 */
	enableModule: ko.observable(false),
	enablePreviewPane: ko.observable(false),
	
	/**
	 * Initializes settings from AppData object sections.
	 * 
	 * @param {Object} oAppData Object contained modules settings.
	 */
	init: function (oAppData)
	{
		var oAppDataSection = oAppData['%ModuleName%'];
		
		if (!_.isEmpty(oAppDataSection))
		{
			this.enableModule(Types.pBool(oAppDataSection.EnableModule, this.enableModule()));
			this.enablePreviewPane(Types.pBool(oAppDataSection.EnablePreviewPane, this.enablePreviewPane()));
		}
	},
	
	/**
	 * Updates module settings after editing.
	 * 
	 * @param {boolean} bEnableModule New value of setting 'EnableModule'
	 * @param {boolean} bEnablePreviewPane New value of setting 'EnablePreviewPane'
	 */
	update: function (bEnableModule, bEnablePreviewPane = this.enablePreviewPane())
	{
		this.enableModule(bEnableModule);
		this.enablePreviewPane(bEnablePreviewPane); 
	}
};
