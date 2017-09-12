'use strict'

var demoGraphicsDashboard = demoGraphicsDashboard || {};

demoGraphicsDashboard.utils = function () {	
	var dataset = new Dataset();
	var bindInitEvents = function () {

		//Bind file upload event;
		$("#txtFileUpload").change(function () {			
			dataset.handleFileUploadEvent();
		});
		
		//Bind clear content button to event;
		$("#btnClearContent").click(function () {
		    dataset.clearContent();
		});

		//Bind apply selection event;
		$("#btnApplySelection").click(function () {
		    dataset.applySelection();
		});
	}();	
}

var utilities = new demoGraphicsDashboard.utils();
