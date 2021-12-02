'use strict';

module.exports = function (oAppData) {
	var
		$ = require('jquery'),
		ko = require('knockout'),
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
				
		Settings = require('modules/%ModuleName%/js/Settings.js'),
		
		bShow = false,
		TemplateName = '%ModuleName%_ItemsView'
	;

	Settings.init(oAppData);
	
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
//				{
					App.subscribeEvent('Files::ChangeItemsView', function (oParam) {
						if (Settings.enableModule())
						{
							oParam.View.itemsViewTemplate(TemplateName);
						}
						Settings.enableModule.subscribe(function(newValue){
							oParam.View.itemsViewTemplate(newValue ? TemplateName : oParam.TemplateName);
						});
					});
//				}
				App.subscribeEvent('FilesWebclient::ShowView::after', function (oParams) {
					var 
						previewFileData = {
							'displayName': ko.observable(''),
							'fileInfo': ko.observable(''),
							'enablePreviewPane': Settings.enablePreviewPane
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
							previewFileData.displayName('');
							previewFileData.fileInfo('');
							$("#files_view_pane").html("");
							if (selectedFile !== undefined && Settings.enablePreviewPane())
							{
								previewFileData.displayName(selectedFile.displayName());
								previewFileData.fileInfo(selectedFile.sHeaderText);
								if (typeof(selectedFile.oExtendedProps) !== 'undefined' &&  typeof(selectedFile.oExtendedProps.InitializationVector) !== 'undefined')
								{
									$("#files_view_pane").html("<span style=\"font-style: normal;\n\
										font-weight: normal;\n\
										font-variant: normal;\n\
										text-transform: none;\n\
										line-height: 1;\n\
										display: inline-block;\n\
										font-size: 200px;\n\
										height: 250px;\n\
										font-family: 'afterlogic';\n\
										width: 500px;\">&#59658;</span>");
								}
								else if (-1 !== $.inArray(selectedFile.mimeType(), aImgMimeTypes))
								{
									$("#files_view_pane").html("<img style='width:100%;' src='" + selectedFile.getActionUrl('view') + "'>");
								}
								else
								{
									$("#files_view_pane").html("<iframe id='view_iframe' name='view_iframe' style='width: 100%; height: 400px; border: none;' src='" + selectedFile.getActionUrl('view') + "'></iframe>");
								}
							}
						});
					}
				});
			}
		};
	}
	
	return null;
};
