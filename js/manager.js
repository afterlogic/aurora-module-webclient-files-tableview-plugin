'use strict';

module.exports = function (oAppData) {
	var
		$ = require('jquery'),
		ko = require('knockout'),
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
				
		Settings = require('modules/%ModuleName%/js/Settings.js'),
		
		bShow = false,
		TemplateName = '%ModuleName%_ItemsView',
		ToggleFilesButtonView = null
	;

	Settings.init(oAppData);

	function getButtonView()
	{
		if (!ToggleFilesButtonView)
		{
			ToggleFilesButtonView = require('modules/%ModuleName%/js/views/ToggleFilesButtonView.js');
		}

		return ToggleFilesButtonView;
	}
	
	if (App.isUserNormalOrTenant())
	{
		return {
			start: function (ModulesManager) {
				ModulesManager.run(
					'SettingsWebclient',
					'registerSettingsTabSection',
					[
						function () { return require('modules/%ModuleName%/js/views/FilesTableviewSettingsFormView.js'); },
						Settings.HashModuleName,
						TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB')
					]
				);

				App.subscribeEvent('FilesWebclient::ConstructView::after', function (oParams) {
					if ('CFilesView' === oParams.Name)
					{
						const originalTemplateName = oParams.View.itemsViewTemplate();

						if (Settings.enableModule())
						{
							oParams.View.itemsViewTemplate(TemplateName);
						}
						Settings.enableModule.subscribe(function(newValue) {
							oParams.View.itemsViewTemplate(newValue ? TemplateName : originalTemplateName);
						});
					}
				});

				App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
					var 
						previewFileData = {
							displayName: ko.observable(''),
							enablePreviewPane: Settings.enablePreviewPane,
							type: ko.observable(''),
							size: ko.observable(''),
							// created: ko.observable(''),
							modified: ko.observable(''),
							location: ko.observable(''),
							extension: ko.observable(''),
							hasSelectedFile: ko.observable(false),
							showPreview: ko.observable(false),
						},
						$RightPannel = $("<!-- ko template: {name: '%ModuleName%_PaneView'} --><!-- /ko -->"),
						aImgMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
					;
					
					if (!bShow)
					{
						bShow = true;

						$("#files_center_panel").after($RightPannel);

						ko.applyBindings(previewFileData, $RightPannel.get(0));

						oParams.View.firstSelectedFile.subscribe(function(selectedFile) {							
							const fileIsSelected = !!selectedFile;
							previewFileData.displayName('');
							previewFileData.type('');
							previewFileData.size('');
							// previewFileData.created('');
							previewFileData.modified('');
							previewFileData.location('');
    						previewFileData.hasSelectedFile(fileIsSelected);
							previewFileData.extension('');
							previewFileData.showPreview(false);
							$("#files_view_pane").html("");

							if (selectedFile !== undefined && Settings.enablePreviewPane())
							{
								previewFileData.displayName(selectedFile.displayName());
								previewFileData.type(selectedFile.type ? selectedFile.type() : '');
								previewFileData.size(selectedFile.friendlySize ? selectedFile.friendlySize() : '');
								// previewFileData.created(selectedFile.sHeaderText ? selectedFile.sHeaderText : '');
								previewFileData.modified(selectedFile.sLastModified ? selectedFile.sLastModified : '');
								previewFileData.location(selectedFile.path && selectedFile.path() ? selectedFile.path() : '/');
								previewFileData.extension(selectedFile.extension ? selectedFile.extension() : '' );


								if (selectedFile.getActionUrl('view') !== '') {
									previewFileData.showPreview(true);
									// paranoid encryption hero
									if (typeof(selectedFile.oExtendedProps) !== 'undefined' &&  typeof(selectedFile.oExtendedProps.InitializationVector) !== 'undefined') {
										$("#files_view_pane").html("<div class='item key'><span class='icon'/></div>");
									} else if (-1 !== $.inArray(selectedFile.mimeType(), aImgMimeTypes)) {
										$("#files_view_pane").html("<img src='" + selectedFile.getActionUrl('view') + "'>");
									} else {
										$("#files_view_pane").html("<iframe class='view_iframe' src='" + selectedFile.getActionUrl('view') + "'></iframe>");
									}
								}
							}
						});
					}
				});

				ModulesManager.run('FilesWebclient', 'registerToolbarButtons', [getButtonView()]);
			},
		};
	}
	
	return null;
};
