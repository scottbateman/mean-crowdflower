'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workflow Schema
 *
 * A workflow is a series of jobs which gather information for a data object.
 * Each Job must use the same type of data.
 */
var WorkflowSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Workflow name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

  /**
   * @todo Make more of these fields required with defaults.
   */

  /**
   * active
   * Whether or not this Workflow is running.
   */
  active: Boolean,

  /**
   * model
   * The type of data that is put through this workflow.
   */
  model: String,

  /**
   * An array of objects which describe the __steps__ in the workflow.
   */
  steps: [{
    /**
     * template
     * Each step is a job which the data goes through. This is the template for
     * the job of this step.
     */
    template: Schema.ObjectId,

    /**
     * queue
     * An array of data object IDs which are waiting to be sent to a job
     * for this step.
     */
    queue: [Schema.ObjectId],

    /**
     * queueLimit
     * The number of objects that must be queued before data is uploaded.
     */
    queueLimit: Number,

    /**
     * requirements
     * An array which describes the requirements for acceptance. The array contains
     * an object for each question. These objects have a `field` value and a
     * `confidence` value.
     */
    requirements: [{
      field: String,
      confidence: Number
    }],

    /**
     * nextPass
     * Contains the index of the step to run if the data unit __passes__ the requirements.
     */
    nextPass: Number,

    /**
     * nextFail
     * Contains the index of the step to run if the data unit __fails__ the requirements.
     */
    nextFail: Number

  }]
});

WorkflowSchema.methods.addStep = function (step, callback) {
  var JobTemplate = mongoose.model('Jobtemplate');
  var template = JobTemplate.findById(step.template);

  var err = null;
  if(template.model === this.model){
    this.steps.push(step);
  }
  else {
    err = new Error('The data model for required for this step does not match the data model of this workflow.');
  }

  callback(err, this);

};


WorkflowSchema.methods.ingestData = function (apiKey, data, callback) {
  var DataType = mongoose.model(this.model);
  var Datastep = mongoose.model('Datastep');
  var dataSteps = [];
  var id = this._id;

  if (!(data instanceof Array)){
    data = [data];
  }

  for (var i=0; i<data.length; i++){
    // Crate new Data object.
    data[i] = new DataType({
      data: data[i]
    });
    data[i].save(datastepstuff.bind(this, i, data[i]));
  }

  callback(null, data);


  function datastepstuff(i, d) {
    dataSteps[i] = new Datastep({
      data: d._id,
      workflow: id,
      units: [],
      currentStep: null,
      finished: false
    });

    dataSteps[i].save();
    dataSteps[i].nextStep(apiKey);
  }
};

WorkflowSchema.methods.pushStepQueue = function (stepIndex, objectId, apiKey, callback) {
  /**
   * @todo Make sure the object is of the right type.
   */
  this.steps[stepIndex].queue.push(objectId);
  var step = this.steps[stepIndex]; // Using this variable didn't workfor the above command.
  this.save(function (err, wf) {
    if (err) callback(err);

    else if (step.queue.length >= step.queueLimit) {
      wf.uploadStepQueue(stepIndex, apiKey, callback)
    }

    else {
      callback('Your data has been queued.');
    }
  }.bind(this));
};

WorkflowSchema.methods.uploadStepQueue = function (stepIndex, apiKey, callback) {
  var step = this.steps[stepIndex];
  var queue = step.queue;
  var DataType = mongoose.model(this.model);
  var Jobtemplate = mongoose.model('Jobtemplate');
  var Job = mongoose.model('Job');

  var jt = Jobtemplate.findById(step.template);

  var job = Job.findOne({template: step.template}, function (err, job) {
    if (err) callback(err);

    else if (job === undefined){
      /** @todo Instantiate job from template. */
      job = jt.createJob(maria);
    }
    else {
      maria(null, job);
    }

    var maria = function (err, job) {
      if (err) callback(err);
      else {
        var queueStrings = [];
        for (var i = 0; i < queue.length; i++) {
          DataType.findById(queue[i], function (err, d) {
            if (err) callback(err);
            if (d)   queueStrings.push(JSON.stringify(d.data));

            if (queueStrings.length === queue.length) {
              job.uploadDataString(queueStrings.join(), apiKey, callback);
            }
          });
        }
      }
    };
  });
};



mongoose.model('Workflow', WorkflowSchema);