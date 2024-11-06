import complexModel from "../models/complex.js";

function getComplexes(name) {
  let promise;
  if (name === undefined) {
    promise = complexModel.find();
  } else {
    promise = findComplexByName(name);
  }
  return promise;
}

function findComplexById(id) {
  return complexModel.findById(id);
}

function findComplexByName(name) {
  return complexModel.find({ name: name });
}

export default {
  getComplexes,
  findComplexById,
  findComplexByName
};
