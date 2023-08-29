// This ApiFeature class allows developers to build advanced queries for
// filtering, sorting, selecting fields, and paginating database results.
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // La consulta de la base de datos
    this.queryString = queryString; // La cadena de consulta de la URL
  }

  search() {
    const { keyword } = this.queryString;

    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");
      this.query = this.query.find({ name: keywordRegex });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["keyword", "limit", "page", "fields", "sort"];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
