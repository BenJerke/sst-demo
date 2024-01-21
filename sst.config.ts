import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack"; // must've been automatically added? or was it here to begin with? 

export default {
  config(_input) {
    return {
      name: "notes",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app
    .stack(StorageStack)
    .stack(ApiStack)
    ;
  },
} satisfies SSTConfig;