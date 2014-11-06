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
  results:  [{
    id: Number,
    difficulty: Number,
    judgments_count: Number,
    state: String,
    missed_count: Number,
    job_id: Number,
    results: {}
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

DatastepSchema.methods.connect = function () {
  return {};
};


/**
 * nextStep
 * @param apiKey
 * @param callback
 *
 * Validates results from latest unit.
 * Determines the next step.
 * Pushes data into the next step.
 *
 * If it's a new unit, it just pushes the data into the first step.
 *
 * @see WorkflowSchema.methods.pushStepQueue
 *
 * Called by:
 * @see WorkflowSchema.methods.ingestData
 *
 */
DatastepSchema.methods.nextStep = function (callback) {
  if (callback===undefined){
    callback = function () {};
  }
  var Workflow = mongoose.model('Workflow');
  var Unit = mongoose.model('Unit');

  var dataStep = this;
  var result = dataStep.results[dataStep.results.length-1].results;

  Workflow.findById(this.workflow,
    function (err, wf) {
      var setStep = function (step) {
        if (step >= 0) {
          dataStep.currentStep = step;
          wf.pushStepQueue(step, dataStep.data, callback);
        }
        else {
          console.log("FINISHED!");
          wf.completed.push(dataStep.data);
        /**
         * @todo push data to origin
         */
          }
        dataStep.save();
      };

      if (dataStep.currentStep === null) {
        setStep(0);
      }
      else {
        var step = wf.steps[dataStep.currentStep];

        // Iterate through requirements
        var field;
        var confidence;
        var accepted = true;
        console.log("Checking Steps (", step.requirements.length, ")");
        for (var i = 0; i < step.requirements.length; i++){
          field = step.requirements[i].field;
          confidence = step.requirements[i].confidence;
          console.log("Field:", field);
          console.log("Confidence Target:", confidence);
          console.log("Confidence Actual:", result[field]);
          if (result[field].confidence < confidence){
            accepted = false;
          }
        }

        if (accepted){
          console.log("PASS");
          setStep(step.nextPass);
        }
        else{
          console.log("FAIL");
          setStep(step.nextFail);
        }
      }
    });
};



mongoose.model('Datastep', DatastepSchema);