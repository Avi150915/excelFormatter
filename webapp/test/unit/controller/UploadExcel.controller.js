/*global QUnit*/

sap.ui.define([
	"uploadexcel/controller/UploadExcel.controller"
], function (Controller) {
	"use strict";

	QUnit.module("UploadExcel Controller");

	QUnit.test("I should test the UploadExcel controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
