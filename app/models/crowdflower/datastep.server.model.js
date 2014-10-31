'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Datastep Schema
 *
 * This object represents a Data object's current position in a workflow.
 * It contains an array of all units created by putting the object through the
 * workflow, and keeps track of which step it is currently on.
 */
var DatastepSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},

  /**
   * workflow
   * Referneces the workflow that the data is being processed by.
   */
  workflow: {
    type: Schema.ObjectId,
    ref: 'Workflow'
  },

  /**
   * data
   * References the data object being processed by the workflow.
   */
  data: Schema.ObjectId,

  /**
   * units
   * An array of Units created during this workflow.
   */
  units: [{
    type: Schema.ObjectId,
    ref: 'Unit'
  }],

  /**
   * currentStep
   * The index of the unit's current step.
   * @see workflow.server.model.js
   */
  currentStep: Number,

  /**
   * finished
   * Set to `TRUE` if the data has been processed.
   */
  finished: Boolean
});


/**
 * nextStep
 * @param callback
 *
 * This function checks the value
 */
DatastepSchema.methods.nextStep = function (apiKey, callback) {
  var Workflow = mongoose.model('Workflow');
  var Unit = mongoose.model('Unit');

  Workflow.findById(this.workflow,
    function (err, wf) {
      var setStep = function (step) {
        if (step >= 0) {
          this.currentStep = step;
          wf.pushStepQueue(step, this.data);
        }
        //else {
          /**
           * @todo push data to origin
           */
        //}
        this.save(callback);
      }.bind(this);

      if (this.currentStep === undefined) {
        setStep(0);
      }
      else {
        var step = wf.steps[this.currentStep];
        var uid = this.units[this.units.length - 1];
        var u = Unit.findById(uid);

        u.crowdflower(apiKey)
          .then(isAccepted)
          .then(selectStep)
          .then(setStep, anError);


        var isAccepted = function (unit) {
          /**
           * @todo Iterate through step.acceptance and check if the c
           */

          for (var i = 0; i < step.requirements.length; i++) {
          }
          return true;
        }.bind(this);

        var selectStep = function (accepted) {
          if (accepted) {
            return step.nextPass;
          }
          return step.nextFail;
        }.bind(this);


        var anErr = function (err) {
        };
      }
    }.bind(this));
};



mongoose.model('Datastep', DatastepSchema);