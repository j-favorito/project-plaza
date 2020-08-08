const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { 
      type: String, 
      required: true 
    },
  projects: [{ 
    projectName:String,
    issues:[
        {
            issueName:String,
            description: String,
            priority: String,
            Completed: Boolean
        }
    ]

  }],
  Date: {
    type: Date,
    default: Date.now()
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User; 