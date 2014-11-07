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
  apiKey: String,

  /**
   * active
   * Whether or not this Workflow is running.
   */
  active: Boolean,

  /**
   * completed
   */
  completed:[Schema.ObjectId],

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
      confidence: Number,
      weight: Number
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


/**
 * ingestData
 * @param data
 * @param callback
 *
 * Creates new data objects, and then creates new datastep objects for each
 * dataobjects, and pushes it into the workflow.
 *
 * @see DatastepSchema.methods.nextStep
 */
WorkflowSchema.methods.ingestData = function (data, callback) {
  var DataType = mongoose.model(this.model);
  var Datastep = mongoose.model('Datastep');
  var id = this._id;

  /**
   * createDataStep
   * @param data_id
   *
   * Creates a Datstep the Datatype just created.
   * Only used in this function.
   */
  var createDataStep = function (data_id) {
    /** @todo move this function to the either the Data or Datastep methods. */
    var ds = new Datastep({
      data: data_id,
      workflow: id,
      units: [],
      currentStep: null,
      finished: false
    });

    ds.save();
    ds.nextStep();
  };

  /**
   * Data passed in is assumed ot be an array.
   */
  if (!(data instanceof Array)){
    data = [data];
  }

  /**
   * Iterate through Data Array and create a new object for each.
   */
  for (var i=0; i<data.length; i++){
    // IDs can be passed in a couple ways. This cleans them up.
    var did = data[i]._id;
    if ( did && !(did instanceof Schema.ObjectId)){
      data[i]._id = mongoose.Types.ObjectId(did.$oid);
    }

    //
    data[i] = new DataType(data[i]);
    data[i].save(createDataStep.bind(null, data[i]._id));
  }

  callback(null, data);
};


/**
 * pushStepQueue
 * @param stepIndex
 * @param objectId
 * @param callback
 *
 * Pushes a new data ObjectId into the queue of the given step.
 * If the queue is full, it uploads the queue.
 *
 * @see WorkflowSchema.methods.uploadStepQueue
 */
WorkflowSchema.methods.pushStepQueue = function (stepIndex, objectId, callback) {
  /**
   * @todo Make sure the object is of the right type.
   */
  this.steps[stepIndex].queue.push(objectId);
  var step = this.steps[stepIndex]; // Using this variable didn't work for the above command.

  this.save(function (err, wf) {
    if (err) callback(err);

    else if (step.queue.length >= step.queueLimit) {
      wf.uploadStepQueue(stepIndex, callback);
    }
    else {
      console.log("why?");
      callback({});
    }
  }.bind(this));
};

/**
 *
 * @param stepIndex
 * @param callback
 *
 * Get-or-creates a Job from this step's template.
 * @see JobtemplateSchema.methods.createJob
 *
 * Creates a string from the data objects in the queue.
 * Uploads the created string to the Job on crowdflower.
 * @see JobSchema.methods.uploadString
 *
 *
 * Called by:
 * @see WorkflowSchema.methods.pushStepQueue
 *
 */
WorkflowSchema.methods.uploadStepQueue = function (stepIndex, callback) {
  var DataType = mongoose.model(this.model);
  var Jobtemplate = mongoose.model('Jobtemplate');
  var Job = mongoose.model('Job');

  var workflow = this;
  var apiKey = this.apiKey;

  var step = this.steps[stepIndex];
  var workflowId = this._id;
  var queue = step.queue;

  Jobtemplate.findById(step.template, function (err, jt) {
    if (err) { console.error(err); }
    else if (jt) {
      Job.findOne({ apiKey: apiKey, template: step.template },
        function (err, job) {
          var createStringAndUpload = function (err, job) {
            if (err) console.error(err);
            else {

              var queueStrings = [];

              // Load each Data object
              for (var i = 0; i < queue.length; i++) {
                DataType.findById(queue[i], function (err, dMongo) {
                  if (err) { callback(err); }
                  else if (dMongo) {
                    var d = dMongo.toObject();
                    // Add the ID of this Workflow to the data to be uploaded.
                    d._wf_id = workflowId;
                    d._s_id = stepIndex;

                    // Create a string from the Data object.
                    queueStrings.push(JSON.stringify(d));

                    if (queueStrings.length === queue.length) {
                      // Merge all strings together and upload them to the job.
                      job.uploadString(queueStrings.join(''), callback);
                      workflow.steps[stepIndex].queue = [];
                      workflow.save();

                    }
                  }
                });
              }
            }
          };

          if (err) console.error(err);
          else if (job === null) {
            // If a job wasn't found, create one.
            job = this.jt.createJob(apiKey, createStringAndUpload);
          }
          else {
            // Upload string to the job.
            createStringAndUpload(null, job);
          }
        }.bind({jt: jt})
      );
    }
  });
};



mongoose.model('Workflow', WorkflowSchema);